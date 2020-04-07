import { isValidHexCode } from './validators';

describe('validators', () => {
  describe('isValidHexCode', () => {
    it('should return true for valid hex codes', () => {
      expect(isValidHexCode('aa')).toBeUndefined();
      expect(isValidHexCode('aaa')).toBeUndefined();
      expect(isValidHexCode('aaaaaa')).toBeUndefined();

      expect(isValidHexCode('123abc')).toBeUndefined();
      expect(isValidHexCode('12')).toBeUndefined();
      expect(isValidHexCode('234')).toBeUndefined();

      expect(isValidHexCode('00')).toBeUndefined();
      expect(isValidHexCode('ff')).toBeUndefined();
      expect(isValidHexCode('000')).toBeUndefined();
      expect(isValidHexCode('fff')).toBeUndefined();
    });

    it('should return an error for invalid hex codes', () => {
      const errCode = {
        code: 'invalidHex',
      };

      expect(isValidHexCode('z')).toEqual(errCode);
      expect(isValidHexCode('f')).toEqual(errCode);
      expect(isValidHexCode('0')).toEqual(errCode);
      expect(isValidHexCode('0000')).toEqual(errCode);
      expect(isValidHexCode('fffff')).toEqual(errCode);
      expect(isValidHexCode('z99999')).toEqual(errCode);
      expect(isValidHexCode('')).toEqual(errCode);
      expect(isValidHexCode('-1')).toEqual(errCode);
      expect(isValidHexCode('1.0')).toEqual(errCode);
    });
  });
});
