import { describe, expect, it } from 'vitest';
import { absRoundedHalfDiff, constrain, spaces, stripBackslashes } from './utils';

describe('strip backslashes', () => {
  it('works with input containing backshashes', () => {
    expect(stripBackslashes('this\\is\\a\\test')).toBe('thisisatest');
  });
  it('works with input not containing backshashes', () => {
    expect(stripBackslashes('thisisatest')).toBe('thisisatest');
  });
  it('works with empty input', () => {
    expect(stripBackslashes('')).toBe('');
  });
});

describe('spaces', () => {
  it('works with positive input', () => {
    expect(spaces(3)).toBe('   ');
  });
  it('works when input is 0', () => {
    expect(spaces(0)).toBe('');
  });
  it('works when input is negative', () => {
    expect(spaces(-2)).toBe('');
  });
});

describe('absRoundedHalfDiff', () => {
  it('works when first number is smaller than second', () => {
    expect(absRoundedHalfDiff(10, 20)).toBe(5);
  });
  it('works when first number is greater than second', () => {
    expect(absRoundedHalfDiff(20, 10)).toBe(5);
  });
});

describe('constrain', () => {
  it('works when number is within interval', () => {
    expect(constrain(5, 0, 10)).toBe(5);
  });
  it('works when number is below interval', () => {
    expect(constrain(-5, 0, 10)).toBe(0);
  });
  it('works when number is above interval', () => {
    expect(constrain(15, 0, 10)).toBe(10);
  });
  it('works when number is below inversed interval', () => {
    expect(constrain(-5, 10, 0)).toBe(0);
  });
  it('works when number is above inversed interval', () => {
    expect(constrain(15, 10, 0)).toBe(10);
  });
});
