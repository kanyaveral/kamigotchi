import { grpc } from '@improbable-eng/grpc-web';
import { createChannel, createClient } from 'nice-grpc-web';

import { KamigazeServiceClient, KamigazeServiceDefinition } from 'engine/types/kamigaze/kamigaze';

// create a KamigazeServiceClient for the SnapshotService
export function create(url: string): KamigazeServiceClient {
  return createClient(KamigazeServiceDefinition, createChannel(url, grpc.WebsocketTransport()));
}
