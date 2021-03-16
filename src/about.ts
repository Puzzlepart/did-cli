require('dotenv').config()
import packageJson from './package.json'
import { print, whiteOnBlack, yellow } from './utils/log'

/**
 * about
 */
export async function option() {
  print(`                                                               
                ddddddd                     ddddddd            
                d:::::d   iiii              d:::::d            
                d:::::d  i::::i             d:::::d            
                d:::::d   iiii              d:::::d            
                d:::::d                     d:::::d            
       ddddddddd::::::d  iiiiii    ddddddddd::::::d            
     d::::::::::::::::d  i::::i  d::::::::::::::::d            
    d:::::::ddddd:::::d  i::::i d:::::::ddddd:::::d            
    d::::::d    d:::::d  i::::i d::::::d    d:::::d            
    d:::::d     d:::::d  i::::i d:::::d     d:::::d            
    d:::::d     d:::::d  i::::i d:::::d     d:::::d            
    d::::::ddddd::::::d  i::::i d::::::ddddd::::::d            
     d::::::::::::::::d  i::::i d:::::::::::::::::d            
       dddddddddddddddd  iiiiii   ddddddddddddddddd`, whiteOnBlack)
  const contributors = packageJson.contributors.map(contributor => contributor.username).join(', ')
  print(`
did-cli is a set of commands to simplify the process of getting started with did.
Questions, comments or feedback? https://github.com/puzzlepart/did-cli
${contributors} are the main contributors`, yellow)
}
