import { html, fixture, expect } from '@open-wc/testing';
import sinon, { stub } from 'sinon';
import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';
import { Router } from '@vaadin/router';
import { localize } from '@lion/localize';

describe('Success window ', () => {
  let element;

  before(async () => {
    element = await fixture(html`<loan-success></loan-success>`);
  });

  /**
   * Test Case 1: Component renders correctly
   */
  it('should render the success page with all elements', async () => {
    expect(element).to.exist;

    const container = element.shadowRoot.querySelector('div');
    expect(container).to.exist;

    const heading = element.shadowRoot.querySelector('h2');
    expect(heading).to.exist;

    const paragraph = element.shadowRoot.querySelector('p');
    expect(paragraph).to.exist;

    const homeButton = element.shadowRoot.querySelector('.home-btn');
    expect(homeButton).to.exist;
  });

  /**
   * Test Case 2: Home button has correct styling
   */
  it('should have correct CSS classes and styling on home button', async () => {
    const homeButton = element.shadowRoot.querySelector('lion-button');

    expect(homeButton).to.exist;

    expect(homeButton.classList.contains('home-btn')).to.be.true;

    expect(homeButton).to.have.property('onclick');
  });
});

describe('error window', () => {
  let element;

  before(async () => {
    element = await fixture(html`<loan-error></loan-error>`);
  });

  /**
   * Test Case 1: Component renders correctly
   */
  it('should render the error page with all elements', async () => {
    expect(element).to.exist;

    const container = element.shadowRoot.querySelector('div');
    expect(container).to.exist;

    const heading = element.shadowRoot.querySelector('h2');
    expect(heading).to.exist;

    const paragraph = element.shadowRoot.querySelector('p');
    expect(paragraph).to.exist;

    const homeButton = element.shadowRoot.querySelector('.home-btn');
    expect(homeButton).to.exist;
  });

  it('should have correct CSS classes and styling on home button', async () => {
    const homeButton = element.shadowRoot.querySelector('lion-button');

    expect(homeButton).to.exist;

    expect(homeButton.classList.contains('home-btn')).to.be.true;

    expect(homeButton.tagName.toLowerCase()).to.equal('lion-button');
  });

  /**
   * Test Case 3: Home button navigation works
   */
  it('should navigate to home page when home button is clicked', async () => {
    const routerSpy = sinon.spy(Router, 'go');

    const homeButton = element.shadowRoot.querySelector('.home-btn');
    expect(homeButton).to.exist;

    homeButton.click();

    expect(routerSpy.calledOnce).to.be.true;

    expect(routerSpy.calledWith('/')).to.be.true;
  });
});
