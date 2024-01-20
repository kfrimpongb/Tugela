import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    register(createUserInput: $input) {
      id
      name
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginUser) {
    login(authLoginInput: $input) {
      accessToken
      user {
        id
        name
        email
      }
    }
  }
`;
