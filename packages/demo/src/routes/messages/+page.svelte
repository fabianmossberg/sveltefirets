<script lang="ts">
  import { Collection } from 'sveltefirets';
  import { limit, orderBy } from 'firebase/firestore';
  import type { IMessage } from '$lib/message.interface';
  import type { PageData } from './$types';
  export let data: PageData;
  $: ({ messages } = data);

  const preloadedMessages: IMessage[] = [{ text: 'preloadedMessage from the server' }];

  let log = true;
</script>

<h2>Messages retrieved via load function:</h2>
<p>Limited to 5 most recent for practicality.</p>

<pre>{JSON.stringify(messages, null, 1)}</pre>

<hr />
<h2>Messages retrieved via Collection component</h2>
<p>
  (it's just a noop pass-through server-side b/c can't do async operations outside of load function)
</p>

<Collection path="messages" queryConstraints={[limit(5), orderBy('updatedAt', 'desc')]} let:data={messagesFromComponent} startWith={preloadedMessages} {log}>
  <pre>{JSON.stringify(messagesFromComponent, null, 2)}</pre>
  <div slot="fallback">No messages found</div>
</Collection>

<label for="">
  <input type="checkbox" bind:checked={log} /> Log
</label>
