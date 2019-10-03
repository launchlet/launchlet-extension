import api from './api.js'
import { _LBX_DISABLE_ENCRYPTION } from '../-shared/_common/global.js'
import { LBXPayloadIsValid } from './logic.js'

const mod = {

	// MESSAGE

	MessageDidReceiveFromActive (event) {
    return {
      DispatchBackgroundStorePrivateKey () {
        mod.CommandPrivateKeyStore(event.message)
      },
      DispatchBackgroundStorePublicKey () {
        mod.CommandPublicKeyStore(event.message)
      },
      DispatchBackgroundStorePayloadEncryptedData () {
        mod.CommandHandleEventStorePayloadEncryptedData(event)
      },
      DispatchBackgroundDeleteKeys() {
      	mod.CommandDeleteKeys();
      },
      DispatchBackgroundLaunch() {
        mod.CommandLaunch(event)
      },
      DispatchBackgroundRunTasks() {
        mod.CommandRunTasks(event)
      },
    }[event.name]();
  },

  // VALUE

  _ValuePrivateKey: undefined,
  ValuePrivateKey (inputData) {
    if (typeof inputData === 'undefined') {
      return mod._ValuePrivateKey;
    };

    mod._ValuePrivateKey = inputData
  },

  _ValueMemoryPayload: undefined,
  ValueMemoryPayload (inputData) {
    if (typeof inputData === 'undefined') {
      return mod._ValueMemoryPayload;
    };

    mod._ValueMemoryPayload = inputData
  },

  // COMMAND

  async CommandHandleEventStorePayloadEncryptedData (event) {
  	try {
      const decryptedPayload = JSON.parse(await mod._CommandDecrypt(event.message, mod.ValuePrivateKey()));

      if (!LBXPayloadIsValid(decryptedPayload)) {
        throw new Error('LBXPayloadNotValid');
      };

      mod.ValueMemoryPayload(decryptedPayload);

      mod._CommandLocalDataSet('LBXPayload', decryptedPayload);

      api.MessageSendToPage('DispatchActivePayloadSuccess', mod.ValueMemoryPayload().LBXPayloadConfirmation, event);
  	} catch (e) {
  		api.MessageSendToPage('DispatchActivePayloadError', e, event);
  	}
  },
  async _CommandDecrypt (param1, param2) {
    if (_LBX_DISABLE_ENCRYPTION()) {
      return Promise.resolve(param1);
    };

    return new Promise(function (resolve, reject) {
      return simpleCrypto.asym.decrypt(param2, (function DeserializeCipher(inputData) {

        // javascript - Converting between strings and ArrayBuffers - Stack Overflow https://stackoverflow.com/a/11058858
        function str2ab(str) {
          var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
          var bufView = new Uint16Array(buf);
          for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
          }
          return buf;
        };

        return Object.keys(inputData).reduce(function (coll, item) {
          coll[item] = str2ab(inputData[item]);

          return coll;
        }, {});
      })(JSON.parse(param1)), reject, function(decrypted){
        return resolve((new TextDecoder("utf-8")).decode(decrypted))
      });
    })
  },

  CommandPrivateKeyStore (inputData) {
    mod._CommandLocalDataSet('LBXPairPrivateKey', inputData);
  },

  CommandPublicKeyStore (inputData) {
    mod._CommandLocalDataSet('LBXPairPublicKey', inputData);
  },

  CommandDeleteKeys () {
    mod._CommandLocalDataSet('LBXPairPrivateKey', null);
    mod._CommandLocalDataSet('LBXPairPublicKey', null);
    mod._CommandLocalDataSet('LBXPayload', null);
  },

  _CommandLocalDataSet (key, inputData) {
    api.LocalDataSet(key, JSON.stringify(inputData));
  },
  async _CommandLocalDataGet (inputData) {
    const outputData = await api.LocalDataGet(inputData);;
    
    if (typeof outputData === 'undefined') {
      return outputData;
    };

    return JSON.parse(outputData);
  },

  CommandLaunch (event) {
    if (!mod.ValueMemoryPayload()) {
      return;
    };

    api.RunDynamicScript(`(function () {
      ${ mod.ValueMemoryPayload().LBXPayloadPackageScript };

      Launchlet.LRTTasksRun([{
        LCHRecipeCallback () {},
        LCHRecipeStyle: \`${ mod.ValueMemoryPayload().LBXPayloadPackageStyle }\`,
        LCHRecipeURLFilter: '*',
        LCHRecipeIsAutomatic: true,
      }]);

      Launchlet.LRTSingletonCreate(Object.assign(${ JSON.stringify(mod.ValueMemoryPayload().LBXPayloadPackageOptions) }, {
        LRTOptionRecipes: ${ mod.ValueMemoryPayload().LBXPayloadRecipes },
      }));
    })()`, event)
  },

  CommandRunTasks (event) {
    if (!mod.ValueMemoryPayload()) {
      return;
    };
    
    api.RunDynamicScript(`(function () {
      ${ mod.ValueMemoryPayload().LBXPayloadPackageScript };
      Launchlet.LRTTasksRun(${ mod.ValueMemoryPayload().LBXPayloadRecipes })
    })()`, event)
  },
  
  // SETUP

  SetupEverything () {
		mod.SetupValuePrivateKey();
    mod.SetupValueMemoryPayload();
		mod.SetupMessageReceiveFromActive();
	},
	async SetupValuePrivateKey() {
	  mod.ValuePrivateKey(await (async function (inputData) {
      if (!inputData) {
        return Promise.resolve(inputData)
      };
	  	
      return new Promise(function (resolve, reject) {
        return simpleCrypto.asym.importEncryptPrivateKey(inputData, reject, resolve);
      })
		})(await mod._CommandLocalDataGet('LBXPairPrivateKey')))
	},
  async SetupValueMemoryPayload() {
    mod.ValueMemoryPayload(await mod._CommandLocalDataGet('LBXPayload'))
  },
	SetupMessageReceiveFromActive() {
		api.MessageReceiveFromActive(mod.MessageDidReceiveFromActive)
	},
  
  // LIFECYCLE

  LifecycleExtensionDidLoad () {
    mod.SetupEverything();
  },

};

mod.LifecycleExtensionDidLoad();

window.LBXBackgroundModule = {
  DispatchBackgroundStorePrivateKey: mod.CommandPrivateKeyStore,
  DispatchBackgroundStorePublicKey: mod.CommandPublicKeyStore,
  DispatchBackgroundDeleteKeys: mod.CommandDeleteKeys,
};
