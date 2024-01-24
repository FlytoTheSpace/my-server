import env from './dotenv'
import Authenticate from './authenticate'
// import Broadcast from './broadcast'
import * from './database'
import GetFunctions from './getFunctions'
import Interfaces from './interfaces'
import Ip from './ip'
import Logs from './logs'
import MusicListAPI from './MusicListAPI'
import Randomchars from './randomchars'
import Root from './root'
import Sendmsg from './sendmsg'
import UI_messages from './UI_messages'

// Export the promise which resolves to the modules
export default {env, Authenticate, /*Broadcast,*/ Database, GetFunctions, Interfaces, Ip, Logs, MusicListAPI, Randomchars, Root, Sendmsg, UI_messages};
