import { ElementRef, Input, Renderer2 } from '@angular/core';

import { Config } from '../config/config';

/**
 * Base class for all Ionic components. Exposes some common functionality
 * that all Ionic components need, such as accessing underlying native elements and
 * sending/receiving app-level events.
 */
/** @hidden */
export class Ion {
  /** @hidden */
  _config: Config;

  /** @hidden */
  _elementRef: ElementRef;

  /** @hidden */
  _renderer: Renderer2;

  /** @hidden */
  _color: string;

  /** @hidden */
  _mode: string;

  /** @hidden */
  _componentName: string;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Input()
  set color(val: string) {
    this._setColor(val);
  }
  get color(): string {
    return this._color;
  }

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"`, `"md"`, or `"wp"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Input()
  set mode(val: string) {
    this._setMode(val);
  }
  get mode(): string {
    return this._mode;
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer2, componentName?: string) {
    this._config = config;
    this._elementRef = elementRef;
    this._renderer = renderer;
    this._componentName = componentName;

    if (componentName) {
      this._setComponentName();
      this._setMode(config.get('mode'));
    }
  }

  /** @hidden */
  setElementClass(className: string, isAdd: boolean) {
    if (isAdd) {
      this._renderer.addClass(this._elementRef.nativeElement, className);
    } else {
      this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
  }

  /** @hidden */
  setElementAttribute(attributeName: string, attributeValue: any) {
    if (null != attributeValue) {
      this._renderer.setAttribute(this._elementRef.nativeElement, attributeName, attributeValue);
    } else {
      this._renderer.removeAttribute(this._elementRef.nativeElement, attributeName);
    }
  }

  /** @hidden */
  setElementStyle(property: string, value: string) {
    if (null != value) {
      this._renderer.setStyle(this._elementRef.nativeElement, property, value);
    } else {
      this._renderer.removeStyle(this._elementRef.nativeElement, property);
    }
  }

  /** @hidden */
  _setColor(newColor: string, componentName?: string) {
    if (componentName) {
      // This is needed for the item-radio
      this._componentName = componentName;
    }
    if (this._color) {
      this.setElementClass(`${this._componentName}-${this._mode}-${this._color}`, false);
    }
    if (newColor) {
      this.setElementClass(`${this._componentName}-${this._mode}-${newColor}`, true);
      this._color = newColor;
    }
  }

  /** @hidden */
  _setMode(newMode: string) {
    if (this._mode) {
      this.setElementClass(`${this._componentName}-${this._mode}`, false);
    }
    if (newMode) {
      this.setElementClass(`${this._componentName}-${newMode}`, true);

      // Remove the color class associated with the previous mode,
      // change the mode, then add the new color class
      this._setColor(null);
      this._mode = newMode;
      this._setColor(this._color);
    }
  }

  /** @hidden */
  _setComponentName() {
    this.setElementClass(this._componentName, true);
  }

  /** @hidden */
  getElementRef(): ElementRef {
    return this._elementRef;
  }

  /** @hidden */
  getNativeElement(): any {
    return this._elementRef.nativeElement;
  }

}
