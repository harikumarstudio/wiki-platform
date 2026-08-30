const fs = require('fs')
const path = require('path')
const readline = require('readline')
const util = require('util')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
const question = util.promisify(rl.question).bind(rl)

const { defaultPathToContent, contentRepFolders } = require('./config/constants.js')

const SYMLINKS_DEST = contentRepFolders.map((folder) => path.join('src', folder))

const existingSymlinks = SYMLINKS_DEST.filter((dest) => {
  try {
    return fs.readlinkSync(dest)
  } catch {
    return false
  }
})

const existingFolders = SYMLINKS_DEST.filter((dest) => {
  try {
    return fs.readdirSync(dest)
  } catch {
    return false
  }
})

const createLinks = (contentPath, link) => {
  console.log(`Checking if symbolic links are installed for ${SYMLINKS_DEST.join(', ')}`)

  existingSymlinks.forEach((dest) => {
    console.log(`Removing old links ${dest}`)
    fs.unlinkSync(dest)
  })

  existingFolders.forEach((dest) => {
    console.log(`Deleting old directory ${dest}`)
    fs.rmSync(dest, { recursive: true, force: true })
  })

  console.log('Creating new links:')
  // If the contentPath is not absolute, we need to make it relative to the src folder
  if (!path.isAbsolute(contentPath)) {
    contentPath = path.relative('src', contentPath)
  }

  if (link) {
    fs.symlinkSync(path.join(contentPath, 'settings'), path.join('src', 'settings'), 'junction')
    console.log(`${contentPath}/settings → src/settings`)

    const categoryPath = path.join('src', link.split('/')[0])
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath)
    }
    fs.symlinkSync(path.join(`../${contentPath}`, link), path.join('src', link), 'junction')
    console.log(`${contentPath}/${link} → src/${link}`)
    console.log(`With default settings, the material is available at: http://localhost:8080/${link}`)
  } else {
    SYMLINKS_DEST.forEach((dest, i) => {
      const source = path.join(contentPath, contentRepFolders[i])
      console.log(`${dest} → ${source}`)
      fs.symlinkSync(source, dest, 'junction')
    })
  }

  console.log('✅ Done')
}

const pathRequest = async () => {
  try {
    const answer = await question(
      `Specify the path to the content repository (press Enter if this is '${defaultPathToContent}'): `,
    )
    return answer.trim() || defaultPathToContent
  } catch (err) {
    console.error('Error: Question rejected', err)
  }
}

const buildTypeRequest = async () => {
  try {
    const answer = await question(
      `Specify the relative path to the material in the format 'section/folder' (press Enter if you want to build the site with all materials): `,
    )
    return answer.trim()
  } catch (err) {
    console.error('Error: Question rejected', err)
  }
}

const create = async () => {
  if (process.env.PATH_TO_CONTENT) {
    console.log('Using settings from .env')
    createLinks(process.env.PATH_TO_CONTENT)
  } else {
    const contentPath = await pathRequest()
    const materialPath = await buildTypeRequest()
    if (materialPath) {
      createLinks(contentPath, materialPath)
    } else {
      createLinks(contentPath)
    }
  }
  rl.close()
}

create()
