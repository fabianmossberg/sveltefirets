<script lang="ts">
  import { logOut, FirebaseUiAuth, updateUserData } from 'sveltefirets';
  import { user } from '$lib/user';
  import { Story } from 'kitbook';
  import Button from 'svelte-pieces/ui/Button.svelte';
</script>

<!-- prettier-ignore -->
# Authentication with FirebaseUi for Web

The easiest method is to use the FirebaseUiAuth component that brings in [FirebaseUI web](https://github.com/firebase/firebaseui-web) and the Firebase 9 compat library via CDN when component mounted.

{#if $user}
  You are logged in and here is your **User** document from Firestore:

  <pre>{JSON.stringify($user, null, 1)}</pre>
  <Button form="filled" onclick={logOut}>Log Out</Button>
{:else}
  <Story name="Spanish">
    <FirebaseUiAuth
      languageCode={'es'}
      signInWith={{ google: true, emailPasswordless: true, anonymous: true }}
      on:updateuserdata={(e) => updateUserData(e.detail.user, e.detail.isNewUser)} />
  </Story>

  It includes support for [42 languages and
  dialects](https://github.com/firebase/firebaseui-web/blob/master/LANGUAGES.md) out of the box.
  Spanish is demoed here and you can also try English with `en` and Arabic (RTL) with `ar` by navigating in the sidebar (refresh to see the different language).

  <div />
{/if}

If you simply add the `<FirebaseUiAuth />` component to your page, you'll receive the English version with Google and Email sign in options (they'll only work if you've enabled them in your Firebase Console of course).

## Customize

If you would like to change languages, sign in methods, or receive the user data back from Firebase upon login to be able to save in your database (Firestore or elsewhere), then the following example will help:

```svelte
<script lang="ts">
  import { FirebaseUiAuth, updateUserData } from 'sveltefirets';
</script>

<FirebaseUiAuth
  languageCode={'es'}
  signInWith={{ google: true, emailPasswordless: true, anonymous: true }}
  on:updateuserdata={(e) => updateUserData(e.detail.user, e.detail.isNewUser)} />
```
*There are other options that can be set like terms of service url. Read the source code until that is documented.*

## Save User to Firestore

The `updateUserData` method seen above will save your user's data to a `users` collection in Firestore and will add a `createdAt` timestamp for new users or `updatedAt` and `lastVisit` timestamps for returning users.

## Create User store

If you utilize `updateUserData` as shown above, then you can eaily create a user store (automatically persisted in local storage) to be used across your application like this:

```ts
import { createUserStore, type IBaseUser } from 'sveltefirets';
import { firebaseConfig } from './firebaseConfig';

interface IUser extends IBaseUser {
  theme: string;
}

export const user = createUserStore<IUser>({
  userKey: `${firebaseConfig.projectId}_firebase_user`,
  log: true,
});
```

Both of those parameters are optional and you could just do `export const user = createUserStore<IUser>();`