import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseConfig } from '../config';
class FB {
    constructor() {
        console.log('initing firebase');
        if (getApps().length) {
            this._firebaseApp = getApp();
        }
        else {
            this._firebaseApp = initializeApp(firebaseConfig);
        }
        this._db = getFirestore();
        enableIndexedDbPersistence(this._db).catch((err) => {
            if (err.code == 'failed-precondition') {
                console.warn('When multiple tabs open, Firestore persistence can only be enabled in one tab at a time.');
            }
            else if (err.code == 'unimplemented') {
                console.warn('The current browser does not support all of the features required to enable Firestore persistence.');
            }
        });
    }
    static getInstance() {
        if (!FB.instance) {
            FB.instance = new FB();
        }
        return FB.instance;
    }
    get firebaseApp() {
        return this._firebaseApp;
    }
    get db() {
        return this._db;
    }
}
// Singleton model from https://dev.to/daviddalbusco/angular-services-without-angular-thank-you-typescript-5ghn
export const firebaseApp = FB.getInstance().firebaseApp;
export const db = FB.getInstance().db;
