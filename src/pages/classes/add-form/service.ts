import request from 'umi-request';

export async function fakeSubmitForm(params: any) {
  return request('/api/addClazz', {
    method: 'POST',
    data: params,
  });
}
