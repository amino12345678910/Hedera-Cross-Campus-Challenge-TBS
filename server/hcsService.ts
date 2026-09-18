import { 
  TopicMessageSubmitTransaction, 
  TopicCreateTransaction, 
  TopicId 
} from '@hashgraph/sdk';
import { getHederaClient } from './hederaClient';

export interface AnchorPayloadInput {
  eventId: string;
  category: string;
  timestamp: string;
  amountMasked?: string;
  status: string;
  evidenceHash: string;
  counterpartyMasked?: string;
  did: string;
}

export interface HcsSubmissionReceipt {
  success: boolean;
  topicId: string;
  sequenceNumber: number;
  transactionId: string;
  runningHash: string;
  consensusTimestamp?: string;
  messageHash: string;
  explorerUrl: string;
}

/**
 * Server-side Hedera Consensus Service (HCS) implementation using official @hashgraph/sdk.
 */
export class ServerHcsService {
  /**
   * Submits a compact, privacy-preserving evidence anchor message to a real HCS Topic on Hedera Testnet.
   * Zero sensitive personal financial data (like national ID, unmasked bank accounts) is included.
   */
  public static async anchorEvidenceMessage(
    topicIdStr: string,
    input: AnchorPayloadInput
  ): Promise<HcsSubmissionReceipt> {
    const { client, isLive, error } = getHederaClient();

    if (!isLive || !client) {
      throw new Error(`Hedera client not live: ${error || 'Credentials missing'}`);
    }

    const topicId = TopicId.fromString(topicIdStr);

    // Compact, tamper-evident proof message
    const compactMessage = JSON.stringify({
      app: 'TrustLine',
      schema: 'HCS-Financial-Evidence-Anchor/v1.0',
      eventId: input.eventId,
      category: input.category,
      evidenceHash: input.evidenceHash,
      timestamp: input.timestamp,
      status: input.status,
      amountMasked: input.amountMasked,
      counterparty: input.counterpartyMasked,
      did: input.did
    });

    console.log(`[HCS] Submitting evidence anchor for ${input.eventId} to Topic ${topicIdStr}...`);

    const submitTx = new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(compactMessage);

    const txResponse = await submitTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    const seqNumber = receipt.topicSequenceNumber ? receipt.topicSequenceNumber.toNumber() : 0;
    const runningHashHex = receipt.topicRunningHash 
      ? Buffer.from(receipt.topicRunningHash).toString('hex') 
      : '';
    const txIdString = txResponse.transactionId.toString();

    // Query mirror node after short propagation window to get consensus timestamp
    let consensusTs = '';
    try {
      await new Promise(r => setTimeout(r, 1200));
      const mirrorResp = await fetch(
        `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicIdStr}/messages/${seqNumber}`
      );
      if (mirrorResp.ok) {
        const mirrorData = await mirrorResp.json();
        consensusTs = mirrorData.consensus_timestamp || '';
      }
    } catch (e) {
      console.warn('[HCS] Mirror node fetch note:', e);
    }

    return {
      success: true,
      topicId: topicIdStr,
      sequenceNumber: seqNumber,
      transactionId: txIdString,
      runningHash: runningHashHex,
      consensusTimestamp: consensusTs || `${Date.now() / 1000}.000000000`,
      messageHash: input.evidenceHash,
      explorerUrl: `https://hashscan.io/testnet/transaction/${txIdString}`
    };
  }

  /**
   * Submits a TrustLine Credential Issuance anchor to HCS.
   * Only anchors the credential ID, hash, and non-sensitive metadata.
   */
  public static async anchorCredentialMessage(
    topicIdStr: string,
    credData: { credentialId: string; credentialHash: string; holderDid: string; issuedAt: string }
  ): Promise<HcsSubmissionReceipt> {
    const { client, isLive, error } = getHederaClient();

    if (!isLive || !client) {
      throw new Error(`Hedera client not live: ${error || 'Credentials missing'}`);
    }

    const topicId = TopicId.fromString(topicIdStr);

    const compactMessage = JSON.stringify({
      type: 'TRUSTLINE_CREDENTIAL_ISSUED',
      credentialId: credData.credentialId,
      credentialHash: credData.credentialHash,
      holderDid: credData.holderDid,
      version: '1.0',
      timestamp: credData.issuedAt
    });

    console.log(`[HCS] Submitting credential anchor for ${credData.credentialId} to Topic ${topicIdStr}...`);

    const submitTx = new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(compactMessage);

    const txResponse = await submitTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    const seqNumber = receipt.topicSequenceNumber ? receipt.topicSequenceNumber.toNumber() : 0;
    const runningHashHex = receipt.topicRunningHash 
      ? Buffer.from(receipt.topicRunningHash).toString('hex') 
      : '';
    const txIdString = txResponse.transactionId.toString();

    let consensusTs = '';
    try {
      await new Promise(r => setTimeout(r, 1200));
      const mirrorResp = await fetch(
        `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicIdStr}/messages/${seqNumber}`
      );
      if (mirrorResp.ok) {
        const mirrorData = await mirrorResp.json();
        consensusTs = mirrorData.consensus_timestamp || '';
      }
    } catch (e) {
      console.warn('[HCS] Mirror node fetch note:', e);
    }

    return {
      success: true,
      topicId: topicIdStr,
      sequenceNumber: seqNumber,
      transactionId: txIdString,
      runningHash: runningHashHex,
      consensusTimestamp: consensusTs || `${Date.now() / 1000}.000000000`,
      messageHash: credData.credentialHash,
      explorerUrl: `https://hashscan.io/testnet/transaction/${txIdString}`
    };
  }

  /**
   * Automatically provisions an HCS Topic on Hedera Testnet if one is not configured.
   */
  public static async createHcsTopic(memo?: string): Promise<{ topicId: string; transactionId: string }> {
    const { client, isLive, error } = getHederaClient();

    if (!isLive || !client) {
      throw new Error(`Hedera client not live: ${error || 'Credentials missing'}`);
    }

    const tx = new TopicCreateTransaction()
      .setTopicMemo(memo || 'TrustLine Portable Financial Reliability Audit Stream');

    const txResponse = await tx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    if (!receipt.topicId) {
      throw new Error('Failed to obtain created TopicId from Hedera receipt');
    }

    const topicIdStr = receipt.topicId.toString();
    console.log(`[HCS] Successfully created new HCS Topic on Hedera Testnet: ${topicIdStr}`);

    return {
      topicId: topicIdStr,
      transactionId: txResponse.transactionId.toString()
    };
  }

  /**
   * Queries the official Hedera Testnet Mirror Node for a specific topic message.
   */
  public static async queryMirrorNodeMessage(topicId: string, sequenceNumber: number): Promise<any> {
    const url = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages/${sequenceNumber}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Mirror Node returned status ${resp.status}: ${resp.statusText}`);
    }
    return await resp.json();
  }

  /**
   * Queries the official Hedera Testnet Mirror Node for recent messages on a topic.
   */
  public static async queryRecentTopicMessages(topicId: string, limit = 15): Promise<any> {
    const url = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages?limit=${limit}&order=desc`;
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Mirror Node returned status ${resp.status}: ${resp.statusText}`);
    }
    return await resp.json();
  }
}
