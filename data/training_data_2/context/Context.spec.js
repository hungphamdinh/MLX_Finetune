import { processRequest } from '../index';

describe('processRequest', () => {
  it('dispatches actions and calls function correctly', async () => {
    const dispatch = jest.fn();
    const actionType = {
      REQUEST: 'REQUEST',
      SUCCESS: 'SUCCESS',
      FAILURE: 'FAILURE',
    };
    const fnc = jest.fn().mockResolvedValue('result');
    const options = { showLoading: true };
    const params = 'params';

    const request = processRequest(dispatch)(actionType, fnc, options);
    const result = await request(params);

    expect(dispatch).toHaveBeenCalledWith({ type: 'REQUEST', payload: params });
    expect(fnc).toHaveBeenCalledWith(params);
    expect(dispatch).toHaveBeenCalledWith({ type: 'SUCCESS', payload: 'result' });
    expect(result).toBe('result');
  });

  it('handles errors correctly', async () => {
    const dispatch = jest.fn();
    const actionType = {
      REQUEST: 'REQUEST',
      SUCCESS: 'SUCCESS',
      FAILURE: 'FAILURE',
    };
    const fnc = jest.fn().mockRejectedValue(new Error('error'));
    const options = { showLoading: true };
    const params = 'params';

    const request = processRequest(dispatch)(actionType, fnc, options);
    const result = await request(params);

    expect(dispatch).toHaveBeenCalledWith({ type: 'REQUEST', payload: params });
    expect(fnc).toHaveBeenCalledWith(params);
    expect(dispatch).toHaveBeenCalledWith({ type: 'FAILURE', payload: 'error' });
    expect(result).toBe(null);
  });
});
