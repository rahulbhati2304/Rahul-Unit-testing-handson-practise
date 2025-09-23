import { html, fixture } from '@open-wc/testing';
import sinon, { stub } from 'sinon';
import { expect } from 'chai';
import '../src/Customer/Customer-details.js';
import { Router } from '@vaadin/router';
import { localize } from '@lion/localize';
let element;

beforeEach(async () => {
  element = await fixture(html`<customer-details></customer-details>`);
});

afterEach(() => {
  sinon.restore();
});

describe('customer details', () => {
  it('should check component accessibility', () => {
    const heading = element.shadowRoot.querySelector('h2');
    expect(element).to.be.accessible;
    expect(heading).to.be.accessible;
  });

  it('should check header label', () => {
    const heading = el.shadowRoot.querySelector('h2');
    expect(element).to.be.accessible;
    expect(heading.innerText).to.equal(
      localize.msg('change-language:customer')
    );
  });

  it('should check inputs', () => {
    const firstName = element.shadowRoot.getElementById('first_name');
    const lastName = element.shadowRoot.getElementById('last_name');
    const dob = element.shadowRoot.getElementById('dateof_birth');
    const email = element.shadowRoot.getElementById('email');
    const mobile = element.shadowRoot.getElementById('mobile_number');
    const monthlysalary = element.shadowRoot.getElementById('monthly_salary');
    const emi = element.shadowRoot.getElementById('EMIs_amount');
    expect(firstName.label).to.equal(localize.msg('change-language:firstname'));
    expect(lastName.label).to.equal(localize.msg('change-language:lastname'));
    expect(dob.label).to.equal(localize.msg('change-language:dateofbirth'));
    expect(email.label).to.equal(localize.msg('change-language:email'));
    expect(mobile.label).to.equal(localize.msg('change-language:mobilenumber'));
    expect(monthlysalary.label).to.equal(
      localize.msg('change-language:monthlysalary')
    );
    expect(emi.label).to.equal(localize.msg('change-language:previousemi'));
  });

  it('should show error when first name is empty', async () => {
    const firstNameInput = element.shadowRoot.querySelector('#first_name');

    firstNameInput.modelValue = '';
    await element.updateComplete;

    firstNameInput.focus();
    firstNameInput.blur();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(firstNameInput.hasFeedbackFor.includes('error')).to.be.true;
  });

  it('should show error for invalid email format', async () => {
    const emailInput = element.shadowRoot.querySelector('#email');

    emailInput.modelValue = 'invalid-email';
    await element.updateComplete;

    emailInput.focus();
    emailInput.blur();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(emailInput.hasFeedbackFor.includes('error')).to.be.true;
  });

  it('should show error for invalid mobile number', async () => {
    const mobileInput = element.shadowRoot.querySelector('#mobile_number');

    mobileInput.modelValue = '123';
    await element.updateComplete;

    mobileInput.focus();
    mobileInput.blur();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mobileInput.hasFeedbackFor.includes('error')).to.be.true;
  });

  it('should check back button click', () => {
    const spy = sinon.spy(Router, 'go');
    element.shadowRoot.getElementById('back-btn').click();
    expect(spy).to.have.called;
    expect(spy.firstCall.args[0]).to.equal('/emidetails');
  });

  xit('should check next button click - success post request with the inputs', () => {
    const spy = sinon.spy(window, 'fetch');
    element.shadowRoot.getElementById('first_name').value = 'John';
    element.shadowRoot.getElementById('last_name').value = 'Max';
    element.shadowRoot.getElementById('dateof_birth').value = '17/01/2007';
    element.shadowRoot.getElementById('email').value = 'John-max@gmail.com';
    element.shadowRoot.getElementById('mobile_number').value = '9123456789';
    element.shadowRoot.getElementById('monthly_salary').value = '10000';
    element.shadowRoot.getElementById('EMIs_amount').value = '100';
    element.shadowRoot.getElementById('terms').value = '';

    const nextBtn = element.shadowRoot?.getElementById('nextbtn');
    nextBtn.click();
    expect(spy.args[0][1].method).to.equal('POST');
    expect(spy.args[0][1].body).deep.equal({
      first_name: 'John',
      last_name: 'Max',
      dateof_birth: '2007-01-17',
      email: 'John-max@gmail.com',
      mobile_number: '9123456789',
      monthly_salary: 10000,
      EMIs_amount: 100,
      terms: [''],
    });
    expect(spy).to.have.called;
    spy.restore();
  });
});
