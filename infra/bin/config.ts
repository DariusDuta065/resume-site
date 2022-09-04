export interface SecretsManagerParams {
  secretName: string;
  githubSecretField: string;
  secretHeaderField: string;
}

export interface GitHubParams {
  branch: string;
  owner: string;
  repo: string;
}

const GITHUB_PARAMS: GitHubParams = {
  branch: "master",
  owner: "dduta065",
  repo: "resume-site",
};
const SECRETS_MANAGER_PARAMS: SecretsManagerParams = {
  secretName: "dariusduta.dev",
  githubSecretField: "github-oauth-token",
  secretHeaderField: "secret-header-value",
};

const params = {
  STACK_PREFIX: "Resume",
  DOMAIN_NAME: "dariusduta.dev",
  ACM_CERT_SSM_PARAM: "/dariusduta.dev/acm-cert-arn",
  GITHUB_PARAMS,
  SECRETS_MANAGER_PARAMS,
};

export default params;
