'use strict';

describe('rocketvoip', function () {

    describe('view_companies', function () {

        beforeEach(function () {
            var mockFunction = function () {
                angular.module('httpBackendMock', ['ngMockE2E'])
                    .run(function ($httpBackend) {
                        var testCompanies = [];
                        var nextId = 0;
                        $httpBackend.whenGET(/\/companies/).respond(function () {
                            return [200, testCompanies, {}];
                        });
                        $httpBackend.whenPOST(/\/companies/).respond(function (method, url, data) {
                            var company = angular.fromJson(data);
                            company.id = nextId;
                            nextId++;
                            testCompanies.push(company);
                            return [200, company, {}];
                        });
                        $httpBackend.whenPUT(/\/companies\//).respond(function (method, url, data) {
                            var company = angular.fromJson(data);
                            angular.forEach(testCompanies, function (cmpny, key) {
                                if (cmpny.id == company.id) {
                                    testCompanies[key] = company;
                                }
                            });
                            return [200, company, {}];
                        });
                        $httpBackend.whenDELETE(/\/companies/).respond(function (method, url) {
                            var split = url.split("/")
                            var id = split[split.length-1].split("?")[0]
                            for (var i = testCompanies.length - 1; i >= 0; i--) {
                                if (testCompanies[i].id == id) {
                                    testCompanies.splice(i, 1);
                                }
                            }
                            return [200, {}, {}];
                        });
                        $httpBackend.whenPOST(/login/).respond(function () {
                            return [200, {},{'X-Auth-Token' : 'Test-Token'}];
                        });
                        $httpBackend.whenGET(/.*/).passThrough();
                    });
            };
            browser.addMockModule('httpBackendMock', mockFunction);
            browser.get('index.html#!/view_companies');
            element(by.id('username')).isPresent().then(function (isPresent) {
                if (isPresent) {
                    element(by.id('username')).clear().sendKeys("test@test.ch");
                    element(by.id('password')).clear().sendKeys("password");
                    element(by.id('viewLoginForm-login')).click();
                    browser.get('index.html#!/view_companies');

                }
            });
        });

        var company1 = {
            name: "Z"
        };
        var company2 = {
            name: "M"
        };
        var company3 = {
            name: "A"
        };


        function addTestCompanies(company) {
            if (company == undefined) {
                company = {
                    name: 'Test-Company'
                }
            }

            element(by.className('button-add-company')).click();
            element(by.model('company.name')).sendKeys(company.name);
            element(by.className('plane-editCompany-save')).click();
        }

        it('should refresh table after deleting a sip client', function () {
            addTestCompanies(company1);
            addTestCompanies(company2);
            addTestCompanies(company3);
            expect(element.all(by.className('view-companies-companyName')).count()).toEqual(3);
            element.all(by.className('view-companies-editcompany')).first().click();
            element(by.id('plane-editCompany-deleteCompany')).click();
            expect(element.all(by.className('view-companies-companyName')).count()).toEqual(2);
        });

        it('should not show delete button (add company)', function () {
            element(by.className('button-add-company')).click();
            expect(element(By.id("plane-editCompany-deleteCompany")).isDisplayed()).toBeFalsy();
        });

        it('should open plane view for new company', function () {
            var plane = element.all(by.className('md-panel company-dialog'));
            expect(plane.count()).toEqual(0);
            element(by.className('button-add-company')).click();
            plane = element.all(by.className('md-panel company-dialog'));
            expect(plane.count()).toEqual(1);
            expect(element(by.className('plane-editCompany-title')).getText()).toEqual('Add a new Company');
        });

        it('should save new company', function () {
            expect(element.all(by.repeater('company in companies')).count()).toEqual(0);
            addTestCompanies();
            expect(element.all(by.repeater('company in companies')).count()).toEqual(1);

        });

        it('should not save new company when close plane', function () {
            expect(element.all(by.repeater('company in companies')).count()).toEqual(0);
            element(by.className('button-add-company')).click();
            var plane = element.all(by.className('md-panel company-dialog'));
            expect(plane.count()).toEqual(1);
            element(by.className('plane-editCompany-close')).click();
            plane = element.all(by.className('md-panel company-dialog'));
            expect(plane.count()).toEqual(0);
            expect(element.all(by.repeater('company in companies')).count()).toEqual(0);
        });

        it('should save company when click save plane (edit company)', function () {
            addTestCompanies();
            var name = '+411111111';
            expect(element.all(by.repeater('company in companies')).count()).toEqual(1);
            expect(element(by.className('view-companies-companyName')).getText()).toEqual('Test-Company');
            element(by.className('view-companies-editcompany')).click();
            element(by.model('company.name')).clear().sendKeys(name);
            element(by.className('plane-editCompany-save')).click();
            expect(element.all(by.repeater('company in companies')).count()).toEqual(1);
            expect(element(by.className('view-companies-companyName')).getText()).toEqual(name);
        });

        it('should not save company when click close plane (edit company)', function () {
            addTestCompanies();
            var name = '+411111111';
            expect(element.all(by.repeater('company in companies')).count()).toEqual(1);
            expect(element(by.className('view-companies-companyName')).getText()).toEqual('Test-Company');
            element(by.className('view-companies-editcompany')).click();
            element(by.model('company.name')).clear().sendKeys(name);
            element(by.className('plane-editCompany-close')).click();
            expect(element.all(by.repeater('company in companies')).count()).toEqual(1);
            expect(element(by.className('view-companies-companyName')).getText()).toEqual('Test-Company');
        });

        it('should not save and close when input is empty', function () {
            element(by.className('button-add-company')).click();
            var plane = element.all(by.className('md-panel company-dialog'));
            expect(plane.count()).toEqual(1);
            var invalid = element.all(by.className('ng-invalid ng-invalid-required ng-touched'));
            expect(invalid.count()).toEqual(0);
            element(by.className('plane-editCompany-save')).click();
            invalid = element.all(by.className('ng-invalid ng-invalid-required ng-touched'));
            expect(invalid.count()).toEqual(1);
            plane = element.all(by.className('md-panel company-dialog'));
            expect(plane.count()).toEqual(1);
        });

        it('should not save and close when input is not complete', function () {
            element(by.className('button-add-company')).click();
            var plane = element.all(by.className('md-panel company-dialog'));
            expect(plane.count()).toEqual(1);
            var invalid = element.all(by.className('ng-invalid ng-invalid-required ng-touched'));
            expect(invalid.count()).toEqual(0);
            element(by.className('plane-editCompany-save')).click();
            invalid = element.all(by.className('ng-invalid ng-invalid-required ng-touched'));
            expect(invalid.count()).toEqual(1);
            plane = element.all(by.className('md-panel company-dialog'));
            expect(plane.count()).toEqual(1);
        });

        it('should sort table by name by default', function () {

            addTestCompanies(company1);
            addTestCompanies(company2);
            addTestCompanies(company3);
            expect(element.all(by.className('view-companies-companyName')).first().getText()).toEqual(company3.name);
            expect(element.all(by.className('view-companies-companyName')).last().getText()).toEqual(company1.name);
        });

        it('should change sort table by name on change', function () {
            addTestCompanies(company1);
            addTestCompanies(company2);
            addTestCompanies(company3);
            expect(element.all(by.className('view-companies-companyName')).first().getText()).toEqual(company3.name);
            expect(element.all(by.className('view-companies-companyName')).last().getText()).toEqual(company1.name);

            element(by.id('view-companies-sort-name')).click();
            expect(element.all(by.className('view-companies-companyName')).last().getText()).toEqual(company3.name);
            expect(element.all(by.className('view-companies-companyName')).first().getText()).toEqual(company1.name);
            element(by.id('view-companies-sort-name')).click();
            expect(element.all(by.className('view-companies-companyName')).first().getText()).toEqual(company3.name);
            expect(element.all(by.className('view-companies-companyName')).last().getText()).toEqual(company1.name);
        });

        it('should filter table ', function () {
            company1 = {
                name: "Z-000000"
            };
            company2 = {
                name: "M"
            };
            company3 = {
                name: "A"
            };
            addTestCompanies(company1);
            addTestCompanies(company2);
            addTestCompanies(company3);
            expect(element.all(by.className('view-companies-companyName')).count()).toEqual(3);
            element(by.id('view-companies-filter-input')).sendKeys('00000');
            expect(element.all(by.className('view-companies-companyName')).count()).toEqual(1);
            expect(element.all(by.className('view-companies-companyName')).first().getText()).toEqual(company1.name);
            element(by.id('view-companies-filter-input')).clear();
            expect(element.all(by.className('view-companies-companyName')).count()).toEqual(3);
        });

    });
});
