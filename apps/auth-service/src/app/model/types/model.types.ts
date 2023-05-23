enum ValidityEnum {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}
export type ModelType = {
  access_token: string;
  client_id: string;
  date: Date;
  validity: ValidityEnum;
  request_id: string;
  device: [
    {
      name: string;
      date: Date;
    }
  ];
};
