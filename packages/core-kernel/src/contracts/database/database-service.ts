import { Interfaces } from "@arkecosystem/crypto";

import { EventDispatcher } from "../kernel/events";
import { Logger } from "../kernel/log";
import { RoundInfo } from "../shared";
import { Wallet, WalletManager } from "../state/wallets";
import {
    BlocksBusinessRepository,
    DelegatesBusinessRepository,
    TransactionsBusinessRepository,
    WalletsBusinessRepository,
} from "./business-repository";
import { Connection } from "./database-connection";

export interface DownloadBlock extends Omit<Interfaces.IBlockData, "transactions"> {
    transactions: string[];
}

export interface DatabaseService {
    walletManager: WalletManager;

    wallets: WalletsBusinessRepository;

    delegates: DelegatesBusinessRepository;

    blocksBusinessRepository: BlocksBusinessRepository;

    transactionsBusinessRepository: TransactionsBusinessRepository;

    connection: Connection;

    logger: Logger;

    emitter: EventDispatcher;

    options: any;

    cache: Map<any, any>;

    restoredDatabaseIntegrity: boolean;

    verifyBlockchain(): Promise<boolean>;

    getActiveDelegates(roundInfo: RoundInfo, delegates?: Wallet[]): Promise<Wallet[]>;

    restoreCurrentRound(height: number): Promise<void>;

    buildWallets(): Promise<void>;

    saveBlock(block: Interfaces.IBlock): Promise<void>;

    saveBlocks(blocks: Interfaces.IBlock[]): Promise<void>;

    // TODO: These methods are exposing database terminology on the business layer, not a fan...

    deleteBlocks(blocks: Interfaces.IBlockData[]): Promise<void>;

    getBlock(id: string): Promise<Interfaces.IBlock>;

    getLastBlock(): Promise<Interfaces.IBlock>;

    getBlocks(offset: number, limit: number, headersOnly?: boolean): Promise<Interfaces.IBlockData[]>;

    getBlocksForDownload(offset: number, limit: number, headersOnly?: boolean): Promise<DownloadBlock[]>;

    /**
     * Get the blocks at the given heights.
     * The transactions for those blocks will not be loaded like in `getBlocks()`.
     * @param {Array} heights array of arbitrary block heights
     * @return {Array} array for the corresponding blocks. The element (block) at index `i`
     * in the resulting array corresponds to the requested height at index `i` in the input
     * array heights[]. For example, if
     * heights[0] = 100
     * heights[1] = 200
     * heights[2] = 150
     * then the result array will have the same number of elements (3) and will be:
     * result[0] = block at height 100
     * result[1] = block at height 200
     * result[2] = block at height 150
     * If some of the requested blocks do not exist in our chain (requested height is larger than
     * the height of our blockchain), then that element will be `undefined` in the resulting array
     * @throws Error
     */
    getBlocksByHeight(heights: number[]): Promise<Interfaces.IBlockData[]>;

    getTopBlocks(count: number): Promise<Interfaces.IBlockData[]>;

    getRecentBlockIds(): Promise<string[]>;

    saveRound(activeDelegates: Wallet[]): Promise<void>;

    deleteRound(round: number): Promise<void>;

    getTransaction(id: string): Promise<any>;

    getForgedTransactionsIds(ids: string[]): Promise<any[]>;

    init(): Promise<void>;

    reset(): Promise<void>;

    loadBlocksFromCurrentRound(): Promise<void>;

    updateDelegateStats(delegates: Wallet[]): void;

    applyRound(height: number): Promise<void>;

    revertRound(height: number): Promise<void>;

    applyBlock(block: Interfaces.IBlock): Promise<void>;

    revertBlock(block: Interfaces.IBlock): Promise<void>;

    verifyTransaction(transaction: Interfaces.ITransaction): Promise<boolean>;

    getBlocksForRound(roundInfo?: RoundInfo): Promise<Interfaces.IBlock[]>;

    getCommonBlocks(ids: string[]): Promise<Interfaces.IBlockData[]>;
}