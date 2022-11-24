import Token from '../../classes/token';
//const Token = required('../../classes/token');

describe('pruebas token', () => {
    test('getJwtToken debe retornar algo', () => {
      expect(Token.getJwtToken({payload: "valor"})).toBeDefined();
    });


  });

