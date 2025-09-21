import { html, fixture, expect } from '@open-wc/testing';
import sinon, { stub } from 'sinon';
import { Header } from '../src/header/Header.js';
import { localize } from '@lion/localize';
describe('loan-header', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<loan-header></loan-header>`);
  });

  afterEach(() => {
    sinon.restore();
  });

  /**
   * Test Case 1: Component renders correctly with all elements
   */
  it('should render the header with all required elements', async () => {
    expect(element).to.exist;

    const container = element.shadowRoot.querySelector('.container');
    expect(container).to.exist;

    const header = element.shadowRoot.querySelector('header');
    expect(header).to.exist;

    const heading = element.shadowRoot.querySelector('header p');
    expect(heading).to.exist;

    const enButton = element.shadowRoot.querySelector('#en-GB');
    const nlButton = element.shadowRoot.querySelector('#nl-NL');

    expect(enButton).to.exist;
    expect(nlButton).to.exist;
    expect(enButton.textContent.trim()).to.equal('EN');
    expect(nlButton.textContent.trim()).to.equal('NL');
  });

  /**
   * Test Case 2: Language buttons have correct initial styling
   */
  it('should have correct initial styling for language buttons', async () => {
    const enButton = element.shadowRoot.querySelector('#en-GB');
    const nlButton = element.shadowRoot.querySelector('#nl-NL');

    expect(enButton.classList.contains('en-GB')).to.be.true;
    expect(enButton.classList.contains('bg-btn-color')).to.be.true;

    expect(nlButton.classList.contains('nl-NL')).to.be.true;
    expect(nlButton.classList.contains('btn-cursor')).to.be.true;
  });

  /**
   * Test Case 3: Clicking EN button activates English locale
   */
  it('should activate English when EN button is clicked', async () => {
    const enButton = element.shadowRoot.querySelector('#en-GB');
    const nlButton = element.shadowRoot.querySelector('#nl-NL');

    enButton.classList.add('btn-cursor');
    enButton.classList.remove('bg-btn-color');
    nlButton.classList.add('bg-btn-color');
    nlButton.classList.remove('btn-cursor');

    const localizeSpy = sinon.spy();
    const originalLocale = Object.getOwnPropertyDescriptor(localize, 'locale');
    Object.defineProperty(localize, 'locale', {
      set: localizeSpy,
      get: () => 'en-GB',
    });

    enButton.click();

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(enButton.classList.contains('bg-btn-color')).to.be.true;
    expect(enButton.classList.contains('btn-cursor')).to.be.false;

    expect(nlButton.classList.contains('btn-cursor')).to.be.true;
    expect(nlButton.classList.contains('bg-btn-color')).to.be.false;

    expect(localizeSpy.calledWith('en-GB')).to.be.true;

    if (originalLocale) {
      Object.defineProperty(localize, 'locale', originalLocale);
    }
  });

  /**
   * Test Case 5: Header has correct CSS structure and styling
   */
  it('should have correct CSS classes and structure', async () => {
    const container = element.shadowRoot.querySelector('.container');
    expect(container).to.exist;

    const header = element.shadowRoot.querySelector('header');
    expect(header).to.exist;

    const btnContainer = element.shadowRoot.querySelector('.btn');
    expect(btnContainer).to.exist;

    const buttonsInContainer = btnContainer.querySelectorAll('button');
    expect(buttonsInContainer).to.have.lengthOf(2);

    const enButton = btnContainer.querySelector('#en-GB');
    const nlButton = btnContainer.querySelector('#nl-NL');

    expect(enButton.id).to.equal('en-GB');
    expect(nlButton.id).to.equal('nl-NL');

    expect(enButton).to.have.property('onclick');
    expect(nlButton).to.have.property('onclick');
  });
});
