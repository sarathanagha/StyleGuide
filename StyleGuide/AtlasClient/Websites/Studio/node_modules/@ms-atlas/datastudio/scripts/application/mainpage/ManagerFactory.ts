/// <reference path="references.ts" />

/*
 * ManagerFactory:
 * The ManagerFactory provides a way for the shell to track singleton objects that store data for other components.
 * These singleton objects will be referred to as Data Managers. A data manager instance exists as a single source of truth
 * for data that persists across multiple component view models. Given a name of a class (as a string), the ManagerFactory
 * will return an instance reference object to the caller. Using this reference, the caller can access an instance of the 
 * class and then release that reference when usage is complete. When an instance has no more references, the instance is 
 * disposed of.
 
 * Example Usage:
 > var ExampleClassRef: IInstanceReference = Microsoft.DataStudio.Application.ManagerFactory.getInstanceOf('Microsoft.DataStudio.Application.ExampleClass')
 > ExampleClassRef.instance.exampleObservable("New Value");
 > // ... more usage logic ...
 > ExampleClassRef.release();
*/

module Microsoft.DataStudio.Application {

    export class ManagerFactoryImpl {

        /* Static factory data - START */
        private static activeInstances: any = {};
        private static activeInstanceReferences: any = {};
        /* Static factory data - END */       

        // Method: getInstanceOf
        // Given the name of a class, return an instance reference to a singleton of that class 
        public static getInstanceOf(className: string): IInstanceReference {
            // If an instance doesn't exist, instantiate it
            if (!(className in ManagerFactoryImpl.activeInstances)) {
                ManagerFactoryImpl.activeInstances[className] = ManagerFactoryImpl.generateInstanceFromName(className);
                ManagerFactoryImpl.activeInstanceReferences[className] = [];
            }

            var instanceReferenceID: string = Date.now().toString();
            ManagerFactoryImpl.activeInstanceReferences[className].push(instanceReferenceID);
            return {
                instance: ManagerFactoryImpl.activeInstances[className],
                release: () => {
                    var disposeRequest: IReferenceDisposeRequest = {
                        className: className,
                        instanceReferenceID: instanceReferenceID
                    };
                    ManagerFactoryImpl.disposeOfInstanceReference(disposeRequest);
                }
            };
        }

        // Method: disposeOfInstanceReference
        // Given a dispose request, this method will clear an instance reference
        // and, if needed, remove an instance
        private static disposeOfInstanceReference(disposeRequest: IReferenceDisposeRequest) {
            var className: string = disposeRequest.className;
            // Filter out the current reference id
            ManagerFactoryImpl.activeInstanceReferences[className] = (ManagerFactoryImpl.activeInstanceReferences[className] || []).filter((rid) => rid != disposeRequest.instanceReferenceID);
            if (ManagerFactoryImpl.activeInstanceReferences[className].length < 1) {
                // If there are no more references to an instance, remove it
                ManagerFactoryImpl.activeInstances[className].dispose();
                delete ManagerFactoryImpl.activeInstances[className];
                delete ManagerFactoryImpl.activeInstanceReferences[className]
            }
        }

        // Method: generateInstanceFromName
        // A helper method to create an instance of a class given the class name as a string
        private static generateInstanceFromName(className: string): IDisposableManager {
            var classInstantiator: any = window;
            var classNamespace: string[] = className.split('.');
            for (var i = 0; i < classNamespace.length; i++) {
                if (classNamespace[i] in classInstantiator) {
                    classInstantiator = classInstantiator[classNamespace[i]];
                } else {
                    throw classNamespace[i] + " does not exist in " + classNamespace.splice(0, i).join('.');
                }
            }
            // Validate that the selected object is a function before calling new
            if (typeof classInstantiator === 'function') {
                return <IDisposableManager>(new classInstantiator());
            }
            throw className + " is not a valid class name";
        }
    }

    ManagerFactory = ManagerFactoryImpl;
}