require('dotenv').config({ path: '.env' })

const DEFAULT_ENVS = {
  BASE_URL: 'https://archvizwiki.com',
  SECTIONS: 'cpp, houdini, python, ai, unreal',
  CONTENT_REP_GITHUB: 'https://github.com/harikumarstudio/wiki-content.git',
  CONTENT_HOT_BACKLOG: 'https://github.com/harikumarstudio/wiki-content/milestone/1',
  CONTENT_REP_FOLDERS: 'cpp, houdini, python, ai, unreal, people, interviews, pages, specials, settings',
  PATH_TO_CONTENT: '../wiki-content',
  DOKA_ORG: 'DOKA_ORG',
  PLATFORM_REP_GITHUB_URL: 'https://github.com/harikumarstudio/wiki-platform',
  CONTENT_REP_GITHUB_URL: 'https://github.com/harikumarstudio/wiki-content',
}

function getEnv(envKey) {
  return process.env[envKey] || DEFAULT_ENVS[envKey]
}

module.exports = {
  baseUrl: getEnv('BASE_URL'),
  mainSections: getEnv('SECTIONS').split(', '),
  contentRepGithub: getEnv('CONTENT_REP_GITHUB'),
  contentRepFolders: getEnv('CONTENT_REP_FOLDERS').split(', '),
  defaultPathToContent: getEnv('PATH_TO_CONTENT'),
  dokaOrgLink: getEnv('DOKA_ORG'),
  platformRepLink: getEnv('PLATFORM_REP_GITHUB_URL'),
  contentRepLink: getEnv('CONTENT_REP_GITHUB_URL'),
  contentHotBacklogLink: getEnv('CONTENT_HOT_BACKLOG'),
}
