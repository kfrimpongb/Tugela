import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: SignupInput!) {
    signup(data: $input) {
      message
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: data) {
    login(data: $input) {
      id
      accessToken
      refreshToken
    }
  }
`;
