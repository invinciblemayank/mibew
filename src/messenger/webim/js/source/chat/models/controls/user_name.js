/**
 * @preserve This file is part of Mibew Messenger project.
 * http://mibew.org
 * 
 * Copyright (c) 2005-2011 Mibew Messenger Community
 * License: http://mibew.org/license.php
 */

(function(Mibew){

    /**
     * @class User name control model
     */
    Mibew.Models.UserNameControl = Mibew.Models.Control.extend(
        /** @lends Mibew.Models.UserNameControl.prototype */
        {
            /**
             * Returns model type
             * @returns {String} Model type
             */
            getModelType: function() {
                return 'UserNameControl';
            },

            /**
             * Change user name at client and server sides
             * @param {String} newName New user name
             */
            changeName: function(newName) {
                // Get thread and user objects
                var user = Mibew.Objects.Models.user;
                var thread = Mibew.Objects.Models.thread;
                // Store old name in closure
                var oldName = user.get('name');
                // Check if name should be changed
                if (! newName || oldName == newName) {
                    return;
                }

                // Try to change user name at the server side
                Mibew.Objects.server.callFunctions(
                    [{
                        "function": "rename",
                        "arguments": {
                            "references": {},
                            "return": {},
                            "threadId": thread.get('id'),
                            "token": thread.get('token'),
                            "name": newName
                        }
                    }],
                    function(args){
                        if (args.errorCode) {
                            // Something went wrong. Show error message and
                            // restore old name
                            Mibew.Objects.Models.Status.message.setMessage(
                                args.errorMessage || 'Cannot rename'
                            );
                            user.set({name: oldName});
                        }
                    },
                    true
                );

                // Change user name at the cient side
                user.set({name: newName});
            }
        }
    );

})(Mibew);