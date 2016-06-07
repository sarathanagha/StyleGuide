export = Main;
declare module Main {
    /**
     * A promise representing an activity that may complete asynchronously. This may be a Q Promise, or
     * any other object that is compliant with the Promises/A+ spec {@link http://promises-aplus.github.io/promises-spec/}.
     */
    interface Promise {
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: () => void, onReject?: (reason?: any) => void): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: () => Promise, onReject?: (reason?: any) => void): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: () => void, onReject?: (reason?: any) => Promise): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: () => PromiseV<UValue>, onReject?: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: () => UValue, onReject?: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: () => PromiseV<UValue>, onReject?: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: () => UValue, onReject?: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UProgress>(onFulfill: () => PromiseN<UProgress>, onReject?: (reason?: PromiseN<UProgress>) => any): PromiseN<UProgress>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue, UProgress>(onFulfill: () => PromiseVN<UValue, UProgress>, onReject?: (reason?: any) => PromiseVN<UValue, UProgress>): PromiseVN<UValue, UProgress>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch(onReject: (reason?: any) => void): Promise;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue>(onReject: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue>(onReject: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UProgress>(onReject: (reason?: any) => PromiseN<UProgress>): PromiseN<UProgress>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue, UProgress>(onReject: (reason?: any) => PromiseVN<UValue, UProgress>): PromiseVN<UValue, UProgress>;
        /**
         * Registers a callback to be invoked when the promise issues progress notification.
         *
         * @param progressCallback A callback to be invoked when the promise issues progress notification.
         * @return A new promise.
         */
        progress(progressCallback: () => void): Promise;
        /**
         * Registers a callback to be invoked when the promise is settled.
         *
         * @return A new promise.
         */
        finally(finallyCallback: () => any): Promise;
    }
    /**
     * A promise representing an activity that may complete asynchronously. This may be a Q Promise, or
     * any other object that is compliant with the Promises/A+ spec {@link http://promises-aplus.github.io/promises-spec/}.
     */
    interface PromiseV<TValue> {
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: (value: TValue) => PromiseV<UValue>, onReject?: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: (value: TValue) => void, onReject?: (reason?: any) => void): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: (value: TValue) => Promise, onReject?: (reason?: any) => void): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: (value: TValue) => void, onReject?: (reason?: any) => Promise): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: (value: TValue) => UValue, onReject?: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: (value: TValue) => PromiseV<UValue>, onReject?: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: (value: TValue) => UValue, onReject?: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UProgress>(onFulfill: (value: TValue) => PromiseN<UProgress>, onReject?: (reason?: PromiseN<UProgress>) => any): PromiseN<UProgress>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue, UProgress>(onFulfill: (value: TValue) => PromiseVN<UValue, UProgress>, onReject?: (reason?: any) => PromiseVN<UValue, UProgress>): PromiseVN<UValue, UProgress>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch(onReject: (reason?: any) => void): Promise;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue>(onReject: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue>(onReject: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UProgress>(onReject: (reason?: any) => PromiseN<UProgress>): PromiseN<UProgress>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue, UProgress>(onReject: (reason?: any) => PromiseVN<UValue, UProgress>): PromiseVN<UValue, UProgress>;
        /**
         * Registers a callback to be invoked when the promise issues progress notification.
         *
         * @param progressCallback A callback to be invoked when the promise issues progress notification.
         * @return A new promise.
         */
        progress(progressCallback: () => void): PromiseV<TValue>;
        /**
         * Registers a callback to be invoked when the promise is settled.
         *
         * @return A new promise.
         */
        finally(finallyCallback: () => any): PromiseV<TValue>;
    }
    /**
     * A promise representing an activity that may complete asynchronously. This may be a Q Promise, or
     * any other object that is compliant with the Promises/A+ spec {@link http://promises-aplus.github.io/promises-spec/}.
     */
    interface PromiseN<TProgress> {
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: () => void, onReject?: (reason?: any) => void): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: () => Promise, onReject?: (reason?: any) => void): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: () => void, onReject?: (reason?: any) => Promise): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: () => PromiseV<UValue>, onReject?: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: () => UValue, onReject?: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: () => PromiseV<UValue>, onReject?: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: () => UValue, onReject?: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UProgress>(onFulfill: () => PromiseN<UProgress>, onReject?: (reason?: PromiseN<UProgress>) => any): PromiseN<UProgress>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue, UProgress>(onFulfill: () => PromiseVN<UValue, UProgress>, onReject?: (reason?: any) => PromiseVN<UValue, UProgress>): PromiseVN<UValue, UProgress>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch(onReject: (reason?: any) => void): Promise;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue>(onReject: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue>(onReject: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UProgress>(onReject: (reason?: any) => PromiseN<UProgress>): PromiseN<UProgress>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue, UProgress>(onReject: (reason?: any) => PromiseVN<UValue, UProgress>): PromiseVN<UValue, UProgress>;
        /**
         * Registers a callback to be invoked when the promise issues progress notification.
         *
         * @param progressCallback A callback to be invoked when the promise issues progress notification.
         * @return A new promise.
         */
        progress(progressCallback: (progressInfo: TProgress) => void): PromiseN<TProgress>;
        /**
         * Registers a callback to be invoked when the promise is settled.
         *
         * @return A new promise.
         */
        finally(finallyCallback: () => any): PromiseN<TProgress>;
    }
    /**
     * A promise representing an activity that may complete asynchronously. This may be a Q Promise, or
     * any other object that is compliant with the Promises/A+ spec {@link http://promises-aplus.github.io/promises-spec/}.
     */
    interface PromiseVN<TValue, TProgress> {
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: (value: TValue) => void, onReject?: (reason?: any) => void): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: (value: TValue) => Promise, onReject?: (reason?: any) => void): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then(onFulfill: (value: TValue) => void, onReject?: (reason?: any) => Promise): Promise;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: (value: TValue) => PromiseV<UValue>, onReject?: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: (value: TValue) => UValue, onReject?: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: (value: TValue) => PromiseV<UValue>, onReject?: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue>(onFulfill: (value: TValue) => UValue, onReject?: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UProgress>(onFulfill: (value: TValue) => PromiseN<UProgress>, onReject?: (reason?: PromiseN<UProgress>) => any): PromiseN<UProgress>;
        /**
         * Registers callbacks to be invoked when the promise is settled.
         *
         * @param onFulfill A callback to be invoked when the promise is fulfilled.
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        then<UValue, UProgress>(onFulfill: (value: TValue) => PromiseVN<UValue, UProgress>, onReject?: (reason?: any) => PromiseVN<UValue, UProgress>): PromiseVN<UValue, UProgress>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch(onReject: (reason?: any) => void): Promise;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue>(onReject: (reason?: any) => PromiseV<UValue>): PromiseV<UValue>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue>(onReject: (reason?: any) => UValue): PromiseV<UValue>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UProgress>(onReject: (reason?: any) => PromiseN<UProgress>): PromiseN<UProgress>;
        /**
         * Registers a callback to be invoked when the promise is rejected.
         *
         * @param onReject A callback to be invoked when the promise is rejected.
         * @return A new promise.
         */
        catch<UValue, UProgress>(onReject: (reason?: any) => PromiseVN<UValue, UProgress>): PromiseVN<UValue, UProgress>;
        /**
         * Registers a callback to be invoked when the promise issues progress notification.
         *
         * @param progressCallback A callback to be invoked when the promise issues progress notification.
         * @return A new promise.
         */
        progress(progressCallback: (progressInfo: TProgress) => void): PromiseVN<TValue, TProgress>;
        /**
         * Registers a callback to be invoked when the promise is settled.
         *
         * @return A new promise.
         */
        finally(finallyCallback: () => any): PromiseVN<TValue, TProgress>;
    }
}
