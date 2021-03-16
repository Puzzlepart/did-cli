require('dotenv').config()
import { print, whiteOnBlack, yellow } from '../../utils/log'
import packageJson from '../../package.json'

/**
 * about
 * 
 * @description About the did-cli
 */
export async function action() {
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
       dddddddddddddddd  iiiiii   ddddddddddddddddd            
                                                               
             The Calendar is Your Timesheet                    
             adjustments to user admin                                               `, whiteOnBlack)
  const contributors = packageJson.contributors.map(contributor => contributor.username).join(', ')
  print(`
did-cli is a set of commands to simplify the process of getting started with did.
Questions, comments or feedback? https://github.com/puzzlepart/did-cli
${contributors} are the main contributors`, yellow)
}
