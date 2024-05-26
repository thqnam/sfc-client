import React, { FC, useCallback, useState, useMemo, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { WalletModalProvider, WalletMultiButton, useWalletModal } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection, PublicKey, TokenAccountsFilter, SystemProgram, Transaction, LAMPORTS_PER_SOL, TransactionInstruction, ComputeBudgetProgram } from '@solana/web3.js';
import { Program, AnchorProvider, setProvider, getProvider, BN } from '@coral-xyz/anchor';
import {
    //TOKEN_PROGRAM_ID,
    //ASSOCIATED_TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { Buffer } from 'buffer';
import './App.css';
window.Buffer = window.Buffer || require("buffer").Buffer;
const WalletComponent: FC<{ endpoint: string }> = ({ endpoint }) => {
    const wallet = useWallet();
    const { publicKey } = useWallet();
    const { setVisible } = useWalletModal();
    const { connection } = useConnection();
    const [targetKey, setTargetKey] = useState<PublicKey | null>(null);
    const [walletAddress, setwalletAddress] = useState<String | null>(null);
    const [walletBalance, setwalletBalance] = useState<number | null>(null);
    const [walletAddressTarget, setwalletAddressTarget] = useState<String | null>(null);
    const [walletBalanceTarget, setwalletBalanceTarget] = useState<number | null>(null);
    const [subIDWalletInforTarget, setSubIDWalletInforTarget] = useState(0);
    const [stableCoinSupply, setstableCoinSupply] = useState<number | null>(null);
    const [walletStableCoin, setwalletStableCoin] = useState<number | null>(null);
    const [walletStableCoinTarget, setwalletStableCoinTarget] = useState<number | null>(null);
    const [subIDWalletStableCoinTarget, setSubIDWalletStableCoinTarget] = useState(0);
    const [totalAssetBase, settotalAssetBase] = useState<number | null>(null);
    const [walletAsset, setwalletAsset] = useState<number | null>(null);
    const [walletAssetTarget, setwalletAssetTarget] = useState<number | null>(null);
    const [subIDMimeInforTarget, setSubIDMimeInforTarget] = useState(0);
    const [targetAddress, settargetAddress] = useState<String | null>(null);
    const [targetAddressTarget, settargetAddressTarget] = useState<String | null>(null);
    const [subIDTargetInforTarget, setSubIDTargetInforTarget] = useState(0);
    const [solanaExplorer, setsolanaExplorer] = useState<String | null>(null);
    const [solScan, setsolScan] = useState<String | null>(null);
    const [accountName, setaccountName] = useState<String | null>(null);
    const [accountNameTarget, setaccountNameTarget] = useState<String | null>(null);
    const [poolGasToken, setpoolGasToken] = useState<number | null>(null);
    const [poolStableCoin, setpoolStableCoin] = useState<number | null>(null);
    const [poolRatio, setpoolRatio] = useState<number | null>(null);
    const [poolKValue, setpoolKValue] = useState<number | null>(null);
    const [walletLPToken, setwalletLPToken] = useState<number | null>(null);
    const [walletLPTokenTarget, setwalletLPTokenTarget] = useState<number | null>(null);
    const [subIDWalletLPTokenTarget, setSubIDWalletLPTokenTarget] = useState(0);
    const [lpTokenSupply, setlpTokenSupply] = useState<number | null>(null);
    const [programTarget, setProgramTarget] = useState<Program | null>(null);
    const [isTarget, setIsTarget] = useState<boolean | null>(null);
    const [isNonTarget, setIsNonTarget] = useState<boolean | null>(null);
    const [isLockTarget, setIsLockTarget] = useState<boolean | null>(null);
    const [isNonLockTarget, setIsNonLockTarget] = useState<boolean | null>(null);
    const [isUseVND, setIsUseVND] = useState<boolean | null>(null);
    const [isNonUseVND, setIsNonUseVND] = useState<boolean | null>(null);
    const fetchWalletBalance = useCallback(async (connection: Connection) => {
        if (!wallet.publicKey) {
            throw new WalletNotConnectedError();
        }
        const walletAddress = wallet.publicKey.toBase58();
        setwalletAddress(walletAddress);
        const walletBalance = await connection.getBalance(new PublicKey(wallet.publicKey));
        setwalletBalance(walletBalance / 1e9);
    }, [wallet.publicKey]);
    const fetchStableCoinSupply = useCallback(async (connection: Connection) => {
        const stableCoinSupply = await connection.getTokenSupply(new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"));
        setstableCoinSupply(Number(stableCoinSupply.value.amount).valueOf() / 1e9);
    }, []);
    const fetchLPTpkenSupply = useCallback(async (connection: Connection) => {
        const lpTokenSupply = await connection.getTokenSupply(new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"));
        setlpTokenSupply(Number(lpTokenSupply.value.amount).valueOf() / 1e9);
    }, []);
    const fetchWalletStableCoin = useCallback(async (connection: Connection) => {
        if (!wallet.publicKey) {
            throw new WalletNotConnectedError();
        }
        const tokenFilt: TokenAccountsFilter = {
            mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        };
        const tokenAcc = await connection.getTokenAccountsByOwner(wallet.publicKey, tokenFilt);
        if (tokenAcc.value.length > 0) {
            const publicKeyToken = tokenAcc.value[0].pubkey;
            const walletStableCoin = await connection.getTokenAccountBalance(publicKeyToken);
            setwalletStableCoin(Number(walletStableCoin.value.amount).valueOf() / 1e9);
            return publicKeyToken;
        } else {
            const walletStableCoin = 0;
            setwalletStableCoin(walletStableCoin);
            alert(`Can't find token account`);
            return wallet.publicKey;
        }
    }, [wallet.publicKey]);
    const fetchWalletLPToken = useCallback(async (connection: Connection) => {
        if (!wallet.publicKey) {
            throw new WalletNotConnectedError();
        }
        const tokenLPFilt: TokenAccountsFilter = {
            mint: new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"),
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        };
        const tokenLPAcc = await connection.getTokenAccountsByOwner(wallet.publicKey, tokenLPFilt);
        if (tokenLPAcc.value.length > 0) {
            const publicKeyToken = tokenLPAcc.value[0].pubkey;
            const walletLPToken = await connection.getTokenAccountBalance(publicKeyToken);
            setwalletLPToken(Number(walletLPToken.value.amount).valueOf() / 1e9);
            return publicKeyToken;
        } else {
            const walletLPToken = 0;
            setwalletLPToken(walletLPToken);
            alert(`Can't find LP token account`);
            return wallet.publicKey;
        }
    }, [wallet.publicKey]);
    const fetchVaultInfo = useCallback(async () => {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("vault")],
            new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
        );
        let accountInfo: any;
        function processAccountInfo() {
            if (accountInfo !== undefined) {
                const totalAssetBase = accountInfo.assetAccount.words[0];
                settotalAssetBase(totalAssetBase);
                const poolKValue = Number(accountInfo.kValue).valueOf() / LAMPORTS_PER_SOL;
                setpoolKValue(poolKValue);
            } else {
                console.error("Account info is not yet fetched.");
            }
        }
        if (programTarget) {
            programTarget.account.userInfor.fetch(pda)
                .then(info => {
                    accountInfo = info;
                    processAccountInfo();
                })
                .catch(error => {
                    console.error('Error fetching account info:', error);
                });
        }
        return pda;
    }, [programTarget]);
    const fetchTargetInfo = useCallback(async () => {
        let thatPubkey: any;
        if (publicKey) {
            thatPubkey = publicKey;
        } else {
            console.error('You not yet choose wallet');
        }
        const [pda3] = PublicKey.findProgramAddressSync(
            [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
            new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
        );
        let accountTarget: any;
        function processAccountTarget() {
            if (accountTarget !== undefined) {
                const targetAddress = accountTarget.assetTarget.toBase58();
                settargetAddress(targetAddress);
            } else {
                console.error("Account target is not yet fetched.");
                const targetAddress = "Non target";
                settargetAddress(targetAddress);
                alert(`Can't find lock target`);
            }
        }
        if (programTarget) {
            programTarget.account.userTarget.fetch(pda3)
                .then(target => {
                    accountTarget = target;
                    processAccountTarget();
                })
                .catch(error => {
                    console.error('Error fetching account target:', error);
                });
        }
        return pda3;
    }, [programTarget, publicKey]);
    const fetchMineInfo = useCallback(async () => {
        let thatPubkey: any;
        if (publicKey) {
            thatPubkey = publicKey;
        } else {
            console.error('You not yet choose wallet');
        }
        const [pda2] = PublicKey.findProgramAddressSync(
            [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
            new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
        );
        let accountInfo2: any;
        function processAccountInfo2() {
            if (accountInfo2 !== undefined) {
                const walletAsset = accountInfo2.assetAccount.words[0];
                setwalletAsset(walletAsset);
                const accountName = accountInfo2.accountName;
                setaccountName(accountName);
            } else {
                console.error("Account info is not yet fetched.");
            }
        }
        if (programTarget) {
            programTarget.account.userInfor.fetch(pda2)
                .then(info => {
                    accountInfo2 = info;
                    processAccountInfo2();
                })
                .catch(error => {
                    console.error('Error fetching account info:', error);
                    const walletAsset = 0;
                    setwalletAsset(walletAsset);
                    alert(`Can't find asset account`);
                    const accountName = "";
                    setaccountName(accountName);
                    alert(`Can't find account name`);
                });
        }
        return pda2;
    }, [programTarget, publicKey]);
    const fetchAMMInfo = useCallback(async (connection: Connection) => {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("vault")],
            new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
        );
        const poolGasToken = await connection.getBalance(pda);
        setpoolGasToken(poolGasToken / 1e9);
        const tokenFilt: TokenAccountsFilter = {
            mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        };
        const tokenAcc2 = await connection.getTokenAccountsByOwner(pda, tokenFilt);
        if (tokenAcc2.value.length > 0) {
            const publicKeyToken = tokenAcc2.value[0].pubkey;
            const poolStableCoin = await connection.getTokenAccountBalance(publicKeyToken);
            setpoolStableCoin(Number(poolStableCoin.value.amount).valueOf() / 1e9);
            const poolRatio = (Number(poolStableCoin.value.amount).valueOf() / 1e9) / (poolGasToken / 1e9);
            setpoolRatio(poolRatio);
            return publicKeyToken;
        } else {
            const poolStableCoin = 0;
            setpoolStableCoin(poolStableCoin);
            alert(`Can't find token account`);
            return pda;
        }
    }, []);
    const fetchBalance = useCallback(async () => {
        setIsNonTarget(true);
        setIsTarget(false);
    }, []);
    const switchNonLockTarget = useCallback(async () => {
        setIsNonLockTarget(true);
        setIsLockTarget(false);
    }, []);
    const switchLockTarget = useCallback(async () => {
        setIsLockTarget(true);
        setIsNonLockTarget(false);
    }, []);
    const switchNonUseVND = useCallback(async () => {
        setIsNonUseVND(true);
        setIsUseVND(false);
    }, []);
    const switchUseVND = useCallback(async () => {
        setIsUseVND(true);
        setIsNonUseVND(false);
    }, []);
    useEffect(() => {
        if (programTarget instanceof Program) {
            setVisible(true);
        } else {
            let thatWallet: any;
            if (wallet) {
                thatWallet = wallet.wallet ? wallet : undefined;
            } else {
                console.error('You not yet choose wallet');
            }
            setProvider(new AnchorProvider(connection, thatWallet, {
                preflightCommitment: 'recent',
            }));
            Program.fetchIdl("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                .then((IDL) => {
                    if (IDL === null) {
                        console.error("Error: IDL not found");
                    } else {
                        const programTarget = new Program(IDL, new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX"), getProvider());
                        setProgramTarget(programTarget);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching IDL: ", error);
                });
        }
    }, [connection, programTarget, setProgramTarget, setVisible, wallet]);
    useEffect(() => {
        if (wallet.connected) {
            fetchBalance();
            switchNonLockTarget();
            switchNonUseVND();
        } else {
            setVisible(true);
        }
    }, [wallet.connected, setVisible, fetchBalance, switchNonLockTarget, switchNonUseVND]);
    useEffect(() => {
        if (!publicKey) {
            return;
        }
        fetchWalletBalance(connection);
        connection.onAccountChange(
            publicKey,
            () => {
                fetchWalletBalance(connection);
            },
            "finalized",
        );
    }, [connection, publicKey, fetchWalletBalance]);
    useEffect(() => {
        if (!publicKey) {
            return;
        }
        fetchStableCoinSupply(connection);
        connection.onAccountChange(
            new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
            () => {
                fetchStableCoinSupply(connection);
            },
            "finalized",
        );
    }, [connection, publicKey, fetchStableCoinSupply]);
    useEffect(() => {
        if (!publicKey) {
            return;
        }
        fetchLPTpkenSupply(connection);
        connection.onAccountChange(
            new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"),
            () => {
                fetchLPTpkenSupply(connection);
            },
            "finalized",
        );
    }, [connection, publicKey, fetchLPTpkenSupply]);
    useEffect(() => {
        if (!publicKey) {
            return;
        }
        fetchWalletStableCoin(connection)
            .then((result) => {
                if (result !== publicKey) {
                    connection.onAccountChange(
                        result,
                        () => {
                            fetchWalletStableCoin(connection);
                        },
                        "finalized",
                    );
                }
            });
    }, [connection, publicKey, fetchWalletStableCoin]);
    useEffect(() => {
        if (!publicKey) {
            return;
        }
        fetchWalletLPToken(connection)
            .then((result) => {
                if (result !== publicKey) {
                    connection.onAccountChange(
                        result,
                        () => {
                            fetchWalletLPToken(connection);
                        },
                        "finalized",
                    );
                }
            });
    }, [connection, publicKey, fetchWalletLPToken]);
    useEffect(() => {
        if (!publicKey) {
            return;
        }
        fetchVaultInfo()
            .then((result) => {
                if (result !== publicKey) {
                    connection.onAccountChange(
                        result,
                        () => {
                            fetchVaultInfo();
                        },
                        "finalized",
                    );
                }
            });
    }, [connection, publicKey, fetchVaultInfo]);
    useEffect(() => {
        if (!publicKey) {
            return;
        }
        fetchTargetInfo()
            .then((result) => {
                if (result !== publicKey) {
                    connection.onAccountChange(
                        result,
                        () => {
                            fetchTargetInfo();
                        },
                        "finalized",
                    );
                }
            });
    }, [connection, publicKey, fetchTargetInfo]);
    useEffect(() => {
        if (!publicKey) {
            return;
        }
        fetchMineInfo()
            .then((result) => {
                if (result !== publicKey) {
                    connection.onAccountChange(
                        result,
                        () => {
                            fetchMineInfo();
                        },
                        "finalized",
                    );
                }
            });
    }, [connection, publicKey, fetchMineInfo]);
    useEffect(() => {
        if (!publicKey) {
            return;
        }
        fetchAMMInfo(connection)
            .then((result) => {
                if (result !== publicKey) {
                    connection.onAccountChange(
                        result,
                        () => {
                            fetchAMMInfo(connection);
                        },
                        "finalized",
                    );
                }
            });
    }, [connection, publicKey, fetchAMMInfo]);
    const [input, setInput] = useState("");
    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInput(event.target.value);
    };
    const [input2, setInput2] = useState("");
    const handleInputChange2 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInput2(event.target.value);
    };
    const [input3, setInput3] = useState("");
    const handleInputChange3 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInput3(event.target.value);
    };
    const [input4, setInput4] = useState("");
    const handleInputChange4 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInput4(event.target.value);
    };
    const fetchWalletBalanceTarget = useCallback(async (connection: Connection) => {
        if (!targetKey) {
            return;
        }
        const walletAddress = targetKey.toBase58();
        setwalletAddressTarget(walletAddress);
        const walletBalance = await connection.getBalance(targetKey);
        setwalletBalanceTarget(walletBalance / 1e9);
    }, [targetKey]);
    const fetchWalletStableCoinTarget = useCallback(async (connection: Connection) => {
        if (!targetKey) {
            return;
        }
        const tokenFilt: TokenAccountsFilter = {
            mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        };
        const tokenAcc = await connection.getTokenAccountsByOwner(targetKey, tokenFilt);
        if (tokenAcc.value.length > 0) {
            const publicKeyToken = tokenAcc.value[0].pubkey;
            const walletStableCoin = await connection.getTokenAccountBalance(publicKeyToken);
            setwalletStableCoinTarget(Number(walletStableCoin.value.amount).valueOf() / 1e9);
            return publicKeyToken;
        } else {
            const walletStableCoin = 0;
            setwalletStableCoinTarget(walletStableCoin);
            alert(`Can't find token account`);
            return targetKey;
        }
    }, [targetKey]);
    const fetchWalletLPTokenTarget = useCallback(async (connection: Connection) => {
        if (!targetKey) {
            return;
        }
        const tokenLPFilt: TokenAccountsFilter = {
            mint: new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"),
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        };
        const tokenLPAcc = await connection.getTokenAccountsByOwner(targetKey, tokenLPFilt);
        if (tokenLPAcc.value.length > 0) {
            const publicKeyToken = tokenLPAcc.value[0].pubkey;
            const walletLPToken = await connection.getTokenAccountBalance(publicKeyToken);
            setwalletLPTokenTarget(Number(walletLPToken.value.amount).valueOf() / 1e9);
            return publicKeyToken;
        } else {
            const walletLPToken = 0;
            setwalletLPTokenTarget(walletLPToken);
            alert(`Can't find LP token account`);
            return targetKey;
        }
    }, [targetKey]);
    const fetchMineInfoTarget = useCallback(async () => {
        if (!targetKey) {
            return;
        }
        const [pda2] = PublicKey.findProgramAddressSync(
            [Buffer.from("client", "utf8"), targetKey.toBuffer()],
            new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
        );
        let accountInfo2: any;
        function processAccountInfo2() {
            if (accountInfo2 !== undefined) {
                const walletAsset = accountInfo2.assetAccount.words[0];
                setwalletAssetTarget(walletAsset);
                const accountName = accountInfo2.accountName;
                setaccountNameTarget(accountName);
            } else {
                console.error("Account info is not yet fetched.");
            }
        }
        if (programTarget) {
            programTarget.account.userInfor.fetch(pda2)
                .then(info => {
                    accountInfo2 = info;
                    processAccountInfo2();
                })
                .catch(error => {
                    console.error('Error fetching account info:', error);
                    const walletAsset = 0;
                    setwalletAssetTarget(walletAsset);
                    alert(`Can't find asset account`);
                    const accountName = "";
                    setaccountNameTarget(accountName);
                    alert(`Can't find account name`);
                });
        }
        return pda2;
    }, [programTarget, targetKey]);
    const fetchTargetInfoTarget = useCallback(async () => {
        if (!targetKey) {
            return;
        }
        const [pda4] = PublicKey.findProgramAddressSync(
            [Buffer.from("target", "utf8"), targetKey.toBuffer()],
            new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
        );
        let accountTarget2: any;
        function processAccountTarget2() {
            if (accountTarget2 !== undefined) {
                const targetAddress = accountTarget2.assetTarget.toBase58();
                settargetAddressTarget(targetAddress);
            } else {
                console.error("Account target is not yet fetched.");
                const targetAddress = "Non target";
                settargetAddressTarget(targetAddress);
                alert(`Can't find lock target`);
            }
        }
        if (programTarget) {
            programTarget.account.userTarget.fetch(pda4)
                .then(target => {
                    accountTarget2 = target;
                    processAccountTarget2();
                })
                .catch(error => {
                    console.error('Error fetching account target:', error);
                });
        }
        return pda4;
    }, [programTarget, targetKey]);
    useEffect(() => {
        if (!targetKey) {
            return;
        }
        fetchWalletBalanceTarget(connection)
            .then(() => {
                let subID = connection.onAccountChange(
                    targetKey,
                    () => {
                        fetchWalletBalanceTarget(connection)
                    },
                    "finalized",
                );
                setSubIDWalletInforTarget(subID);
            })
    }, [connection, targetKey, fetchWalletBalanceTarget, setSubIDWalletInforTarget]);
    useEffect(() => {
        if (!targetKey) {
            return;
        }
        fetchWalletStableCoinTarget(connection)
            .then((result) => {
                if (!result) {
                    return;
                }
                let subID = connection.onAccountChange(
                    result,
                    () => {
                        fetchWalletStableCoinTarget(connection)
                    },
                    "finalized",
                );
                setSubIDWalletStableCoinTarget(subID);
            })
    }, [connection, targetKey, fetchWalletStableCoinTarget, setSubIDWalletStableCoinTarget]);
    useEffect(() => {
        if (!targetKey) {
            return;
        }
        fetchWalletLPTokenTarget(connection)
            .then((result) => {
                if (!result) {
                    return;
                }
                let subID = connection.onAccountChange(
                    result,
                    () => {
                        fetchWalletLPTokenTarget(connection)
                    },
                    "finalized",
                );
                setSubIDWalletLPTokenTarget(subID);
            })
    }, [connection, targetKey, fetchWalletLPTokenTarget, setSubIDWalletLPTokenTarget]);
    useEffect(() => {
        if (!targetKey) {
            return;
        }
        fetchMineInfoTarget()
            .then((result) => {
                if (!result) {
                    return;
                }
                let subID = connection.onAccountChange(
                    result,
                    () => {
                        fetchMineInfoTarget()
                    },
                    "finalized",
                );
                setSubIDMimeInforTarget(subID);
            })
    }, [connection, targetKey, fetchMineInfoTarget]);
    useEffect(() => {
        if (!targetKey) {
            return;
        }
        fetchTargetInfoTarget()
            .then((result) => {
                if (!result) {
                    return;
                }
                let subID = connection.onAccountChange(
                    result,
                    () => {
                        fetchTargetInfoTarget()
                    },
                    "finalized",
                );
                setSubIDTargetInforTarget(subID);
            })
    }, [connection, targetKey, fetchTargetInfoTarget]);
    const handleButtonClick = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let accountTarget: any;
            let flashTargetKey: any;
            async function processAccountTarget() {
                if (accountTarget !== undefined) {
                    if (accountTarget.assetTarget !== input3 && input3 !== "") {
                        flashTargetKey = input3;
                    } else {
                        flashTargetKey = accountTarget.assetTarget
                    }
                    if (flashTargetKey !== targetKey) {
                        if (subIDMimeInforTarget !== 0) {
                            await connection.removeAccountChangeListener(subIDMimeInforTarget);
                        }
                        if (subIDTargetInforTarget !== 0) {
                            await connection.removeAccountChangeListener(subIDTargetInforTarget);
                        }
                        if (subIDWalletInforTarget !== 0) {
                            await connection.removeAccountChangeListener(subIDWalletInforTarget);
                        }
                        if (subIDWalletLPTokenTarget !== 0) {
                            await connection.removeAccountChangeListener(subIDWalletLPTokenTarget);
                        }
                        if (subIDWalletStableCoinTarget !== 0) {
                            await connection.removeAccountChangeListener(subIDWalletStableCoinTarget);
                        }
                        setTargetKey(flashTargetKey);
                    }
                    setIsNonTarget(false);
                    setIsTarget(true);
                }
            }
            if (programTarget) {
                programTarget.account.userTarget.fetch(pda3)
                    .then(target => {
                        accountTarget = target;
                        processAccountTarget();
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
            }

        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, targetKey, subIDMimeInforTarget, subIDTargetInforTarget, subIDWalletInforTarget, subIDWalletLPTokenTarget, subIDWalletStableCoinTarget, connection]);
    const finalTransaction = useCallback(async (isTarget: boolean, transaction: Transaction, connection: Connection) => {
        let txIntruPlus: TransactionInstruction = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: Number(input4).valueOf() });
        transaction.add(txIntruPlus);
        let txHash = await wallet.sendTransaction(transaction, connection);
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        await connection.confirmTransaction(
            {
                blockhash,
                lastValidBlockHeight,
                signature: txHash,
            },
            "finalized"
        );
        const solanaExplorer = `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
        const solScan = `https://solscan.io/tx/${txHash}?cluster=devnet`;
        setsolanaExplorer(solanaExplorer);
        setsolScan(solScan);
        if (isTarget) {
            await handleButtonClick();
        } else {
            await fetchBalance();
        }
        alert('Press ok and look to right side of this site');
    }, [fetchBalance, handleButtonClick, input4, wallet]);
    const handleButtonUserMessageLinkCall = useCallback(async () => {
        let txIntru: TransactionInstruction;
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda2] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            if (programTarget) {
                txIntru = await programTarget.methods
                    .userMessage(input)
                    .accounts({
                        client: pda2,
                        signer: thatPubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction()
                return txIntru;
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input]);
    const handleButtonUserMessageTargetLinkCall = useCallback(async (targetKey: PublicKey) => {
        let txIntru: TransactionInstruction;
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [toDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), targetKey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const [targetDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const [fromDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            try {
                if (programTarget) {
                    txIntru = await programTarget.methods
                        .userMessageTarget(input)
                        .accounts({
                            target: targetDataPda,
                            fromclient: fromDataPda,
                            toclient: toDataPda,
                            signer: thatPubkey,
                        })
                        .instruction();
                    return txIntru;
                }
            } catch (e) {
                console.log(`${e}`);
                alert(e);
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input]);
    const handleButtonTransferAssetLinkCall = useCallback(async (linkamount: number) => {
        let txIntru: TransactionInstruction;
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let targetKey: any;
            if (programTarget) {
                const result = await programTarget.account.userTarget.fetch(pda3)
                    .then(async target => {
                        if (target.assetTarget !== input3 && input3 !== "") {
                            targetKey = input3;
                        } else {
                            targetKey = target.assetTarget;
                        }
                        const [toDataPda] = PublicKey.findProgramAddressSync(
                            [Buffer.from("client", "utf8"), targetKey.toBuffer()],
                            new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                        );
                        const [targetDataPda] = PublicKey.findProgramAddressSync(
                            [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                            new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                        );
                        const [fromDataPda] = PublicKey.findProgramAddressSync(
                            [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                            new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                        );
                        try {
                            const amountBN = new BN(linkamount / 100000);
                            if (programTarget) {
                                txIntru = await programTarget.methods
                                    .tranferAsset(amountBN)
                                    .accounts({
                                        target: targetDataPda,
                                        fromclient: fromDataPda,
                                        toclient: toDataPda,
                                        signer: thatPubkey,
                                    })
                                    .instruction();
                                return txIntru;
                            }
                        } catch (e) {
                            console.log(`${e}`);
                            alert(e);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
                if (result instanceof TransactionInstruction) {
                    txIntru = result;
                    return txIntru;
                }
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input3]);
    const handleButtonTransferSolLinkCall = useCallback(async (linkamount: number) => {
        let txIntru: TransactionInstruction;
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let targetKey: any;
            if (programTarget) {
                const result = await programTarget.account.userTarget.fetch(pda3)
                    .then(async target => {
                        if (target.assetTarget !== input3 && input3 !== "") {
                            targetKey = input3;
                        } else {
                            targetKey = target.assetTarget;
                        }
                        try {
                            let realamount = linkamount * LAMPORTS_PER_SOL;
                            const amountBN = new BN(realamount);
                            if (programTarget) {
                                txIntru = await programTarget.methods
                                    .tranferSol(amountBN)
                                    .accounts({
                                        target: targetKey,
                                        signer: thatPubkey,
                                        systemProgram: SystemProgram.programId,
                                    })
                                    .instruction();
                                return txIntru;
                            }
                        } catch (e) {
                            console.log(`${e}`);
                            alert(e);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
                if (result instanceof TransactionInstruction) {
                    txIntru = result;
                    return txIntru;
                }
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input3]);
    const handleButtonTransferSFCLinkCall = useCallback(async (linkamount: number) => {
        let txIntru: TransactionInstruction;
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let targetKey: any;
            if (programTarget) {
                const result = await programTarget.account.userTarget.fetch(pda3)
                    .then(async target => {
                        if (target.assetTarget !== input3 && input3 !== "") {
                            targetKey = input3;
                        } else {
                            targetKey = target.assetTarget;
                        }
                        const connection = new Connection(endpoint, 'finalized');
                        const tokenFiltSFC: TokenAccountsFilter = {
                            mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                        };
                        const fromTokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltSFC);
                        const toTokenAcc = await connection.getParsedTokenAccountsByOwner(targetKey, tokenFiltSFC);
                        try {
                            let realamount = linkamount * LAMPORTS_PER_SOL;
                            const amountBN = new BN(realamount);
                            if (programTarget) {
                                txIntru = await programTarget.methods
                                    .tranferToken(amountBN, true)
                                    .accounts({
                                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                                        fromtoken: fromTokenAcc.value[0].pubkey,
                                        totoken: toTokenAcc.value[0].pubkey,
                                        signer: thatPubkey,
                                    })
                                    .instruction();
                                return txIntru;
                            }
                        } catch (e) {
                            console.log(`${e}`);
                            alert(e);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
                if (result instanceof TransactionInstruction) {
                    txIntru = result;
                    return txIntru;
                }
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint]);
    const handleButtonTransferLPLinkCall = useCallback(async (linkamount: number) => {
        let txIntru: TransactionInstruction;
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let targetKey: any;
            if (programTarget) {
                const result = await programTarget.account.userTarget.fetch(pda3)
                    .then(async target => {
                        if (target.assetTarget !== input3 && input3 !== "") {
                            targetKey = input3;
                        } else {
                            targetKey = target.assetTarget;
                        }
                        const connection = new Connection(endpoint, 'finalized');
                        const tokenFiltSFC: TokenAccountsFilter = {
                            mint: new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"),
                            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                        };
                        const fromTokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltSFC);
                        const toTokenAcc = await connection.getParsedTokenAccountsByOwner(targetKey, tokenFiltSFC);
                        try {
                            let realamount = linkamount * LAMPORTS_PER_SOL;
                            const amountBN = new BN(realamount);
                            if (programTarget) {
                                txIntru = await programTarget.methods
                                    .tranferToken(amountBN, false)
                                    .accounts({
                                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                                        fromtoken: fromTokenAcc.value[0].pubkey,
                                        totoken: toTokenAcc.value[0].pubkey,
                                        signer: thatPubkey,
                                    })
                                    .instruction();
                                return txIntru;
                            }
                        } catch (e) {
                            console.log(`${e}`);
                            alert(e);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
                if (result instanceof TransactionInstruction) {
                    txIntru = result;
                    return txIntru;
                }
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint]);
    /*
    const handleButtonCreateVaultSFC = useCallback(async () => {
        try {
            const mintString = "4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ";
            const mintSFC = new PublicKey(mintString);
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const connection = new Connection(endpoint, 'finalized');
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const tokenAccount = getAssociatedTokenAddressSync(
                mintSFC,
                pda,
                true,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );
            const ataInfo = await connection.getAccountInfo(tokenAccount);
            if (ataInfo === null) {
                const createTokenAccountIx = createAssociatedTokenAccountInstruction(
                    thatPubkey,
                    tokenAccount,
                    pda,
                    mintSFC,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                );
                const transaction = new Transaction().add(createTokenAccountIx);
                alert(`Vault SFC Token account opening`);
                const txHash = await wallet.sendTransaction(transaction, connection);
                await connection.confirmTransaction(txHash);
                alert(`Vault SFC Token account opened successful`);
                finalTransaction(txHash, false);
            } else {
                alert(`Vault SFC Token account already exists`);
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, endpoint, wallet, fetchBalance]);
    */
    const handleButtonSimulateBuy = useCallback(async () => {
        try {
            let t1: any, t2: any;
            if (poolGasToken) {
                t1 = poolGasToken * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            if (poolStableCoin) {
                t2 = poolStableCoin * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            let k1 = Number(poolKValue).valueOf() * LAMPORTS_PER_SOL;
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            let k2 = t1 - realamount;
            let k3 = k1 / k2 * LAMPORTS_PER_SOL;
            let k4 = k3 - t2;
            let k5 = k4 / LAMPORTS_PER_SOL;
            alert(`You will pay ${k5} SFC - VND if you buy ${input2} Dev Sol`);
            alert(`With price ${k5 / amount} for each Dev Sol`);
            alert(`And ratio will be Dev Sol 1 : ${k3 / k2} SFC - VND`);
            return k5;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [poolGasToken, poolStableCoin, poolKValue, input2]);
    const handleButtonSimulateSell = useCallback(async () => {
        try {
            let t1: any, t2: any;
            if (poolGasToken) {
                t1 = poolGasToken * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            if (poolStableCoin) {
                t2 = poolStableCoin * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            let k1 = Number(poolKValue).valueOf() * LAMPORTS_PER_SOL;
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            let k2 = t1 + realamount;
            let k3 = k1 / k2 * LAMPORTS_PER_SOL;
            let k4 = t2 - k3;
            let k5 = k4 / LAMPORTS_PER_SOL;
            alert(`You will earn ${k5} SFC - VND if you sell ${input2} Dev Sol`);
            alert(`With price ${k5 / amount} for each Dev Sol`);
            alert(`And ratio will be Dev Sol 1 : ${k3 / k2} SFC - VND`);
            return k5;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [poolGasToken, poolStableCoin, poolKValue, input2]);
    const handleButtonSimulateMintLP = useCallback(async () => {
        try {
            let t0: any, t1: any, t2: any;
            if (lpTokenSupply) {
                t0 = lpTokenSupply * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            if (poolGasToken) {
                t1 = poolGasToken * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            if (poolStableCoin) {
                t2 = poolStableCoin * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            let k0 = Number(input2).valueOf();
            let k1 = k0 / t0 * t1;
            let k2 = Number(poolRatio).valueOf();
            let k3 = k1 * k2;
            let k4 = k3 * LAMPORTS_PER_SOL;
            let k5 = t1 + Number(input2).valueOf() * LAMPORTS_PER_SOL;
            let k6 = t2 + k4;
            let amount_sfc = k4 / LAMPORTS_PER_SOL;
            let k7 = ((k5 / LAMPORTS_PER_SOL) * (k6 / LAMPORTS_PER_SOL)) * LAMPORTS_PER_SOL;
            alert(`If you want mint ${input2} LPSFC from the LP Pool Vault`);
            alert(`You will provide ${k1} Dev Sol to the LP Pool Vault`);
            alert(`And will provide ${amount_sfc} SFC - VND at the same time`);
            alert(`With ratio Dev Sol 1 : ${poolRatio} SFC - VND`);
            alert(`And pool K value will be change to ${k7 / LAMPORTS_PER_SOL}`);
            return amount_sfc;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [poolGasToken, poolStableCoin, poolRatio, lpTokenSupply, input2]);
    const handleButtonSimulateBurnLP = useCallback(async () => {
        try {
            let t0: any, t1: any, t2: any;
            if (lpTokenSupply) {
                t0 = lpTokenSupply * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            if (poolGasToken) {
                t1 = poolGasToken * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            if (poolStableCoin) {
                t2 = poolStableCoin * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            let k0 = Number(input2).valueOf();
            let k1 = k0 / t0 * t1;
            let k2 = Number(poolRatio).valueOf();
            let k3 = k1 * k2;
            let k4 = k3 * LAMPORTS_PER_SOL;
            let k5 = t1 - Number(input2).valueOf() * LAMPORTS_PER_SOL;
            let k6 = t2 - k4;
            let amount_sfc = k4 / LAMPORTS_PER_SOL;
            let k7 = ((k5 / LAMPORTS_PER_SOL) * (k6 / LAMPORTS_PER_SOL)) * LAMPORTS_PER_SOL;
            alert(`If you want burn ${input2} LPSFC to the LP Pool Vault`);
            alert(`You want withdraw ${k1} Dev Sol from the LP Pool Vault`);
            alert(`And will withdraw ${amount_sfc} SFC - VND at the same time`);
            alert(`With ratio Dev Sol 1 : ${poolRatio} SFC - VND`);
            alert(`And pool K value will be change to ${k7 / LAMPORTS_PER_SOL}`);
            return amount_sfc;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [poolGasToken, poolStableCoin, poolRatio, lpTokenSupply, input2]);
    const handleButtonSimulateBurnLPPlus = useCallback(async () => {
        try {
            let t0: any, t1: any;
            if (lpTokenSupply) {
                t0 = lpTokenSupply * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            if (poolGasToken) {
                t1 = poolGasToken * LAMPORTS_PER_SOL;
            } else {
                console.error('You not yet choose wallet');
            }
            let k0 = Number(input2).valueOf();
            let k1 = k0 / t0 * t1;
            return k1;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [poolGasToken, lpTokenSupply, input2]);
    const handleButtonSummonLP = useCallback(async () => {
        try {
            const amountLinkCall = await handleButtonSimulateMintLP();
            let mintString = "8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He";
            let mint = new PublicKey(mintString);
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFiltSFC: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltSFC);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFiltSFC);
            const tokenFiltLP: TokenAccountsFilter = {
                mint: new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc3 = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltLP);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            let ratio = Number(poolRatio).valueOf();
            let realratio = ratio * LAMPORTS_PER_SOL;
            const ratioBN = new BN(realratio);
            const bumpBN = new BN(bump);
            if (programTarget) {
                alert(`You providing your liquidity to the vault`);
                let txIntru1 = await programTarget.methods
                    .provideLiquidity(amountBN, ratioBN, bumpBN)
                    .accounts({
                        donatorsfc: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        donatorlp: tokenAcc3.value[0].pubkey,
                        vaultsol: pda,
                        mint: mint,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                let transaction = new Transaction().add(txIntru1);
                if (input !== "") {
                    const result = await handleButtonUserMessageLinkCall();
                    if (result instanceof TransactionInstruction) {
                        let intru2: TransactionInstruction | null = null;
                        intru2 = result;
                        transaction.add(intru2);
                    }
                }
                await finalTransaction(false, transaction, connection);
                alert(`You has been provided your liquidity to the vault successful`);

            }
            return amountLinkCall;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [handleButtonSimulateMintLP, publicKey, endpoint, input2, poolRatio, programTarget, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonSummonLPTarget = useCallback(async () => {
        try {
            const amountLinkCall = await handleButtonSimulateMintLP();
            let mintString = "8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He";
            let mint = new PublicKey(mintString);
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFiltSFC: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltSFC);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFiltSFC);
            const tokenFiltLP: TokenAccountsFilter = {
                mint: new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc3 = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltLP);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            let ratio = Number(poolRatio).valueOf();
            let realratio = ratio * LAMPORTS_PER_SOL;
            const ratioBN = new BN(realratio);
            const bumpBN = new BN(bump);
            if (programTarget) {
                alert(`You providing your liquidity to the vault`);
                let txIntru1 = await programTarget.methods
                    .provideLiquidity(amountBN, ratioBN, bumpBN)
                    .accounts({
                        donatorsfc: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        donatorlp: tokenAcc3.value[0].pubkey,
                        vaultsol: pda,
                        mint: mint,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                let transaction = new Transaction().add(txIntru1);
                const result = await handleButtonTransferLPLinkCall(amount);
                if (result instanceof TransactionInstruction) {
                    let intru2: TransactionInstruction | null = null;
                    intru2 = result;
                    transaction.add(intru2);
                }
                if (input !== "") {
                    const result = await handleButtonUserMessageLinkCall();
                    if (result instanceof TransactionInstruction) {
                        let intru3: TransactionInstruction | null = null;
                        intru3 = result;
                        transaction.add(intru3);
                    }
                }
                await finalTransaction(true, transaction, connection);
                alert(`You has been provided your liquidity to the vault successful`);
            }
            return amountLinkCall;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [handleButtonSimulateMintLP, publicKey, endpoint, input2, poolRatio, programTarget, handleButtonTransferLPLinkCall, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonSummonLPLC = useCallback(async () => {
        try {
            let mintString = "8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He";
            let mint = new PublicKey(mintString);
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFiltSFC: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltSFC);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFiltSFC);
            const tokenFiltLP: TokenAccountsFilter = {
                mint: new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc3 = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltLP);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            let ratio = Number(poolRatio).valueOf();
            let realratio = ratio * LAMPORTS_PER_SOL;
            const ratioBN = new BN(realratio);
            const bumpBN = new BN(bump);
            if (programTarget) {
                let txHash: TransactionInstruction = await programTarget.methods
                    .provideLiquidity(amountBN, ratioBN, bumpBN)
                    .accounts({
                        donatorsfc: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        donatorlp: tokenAcc3.value[0].pubkey,
                        vaultsol: pda,
                        mint: mint,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction()
                return txHash;
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, endpoint, input2, poolRatio, programTarget]);
    const handleButtonBuySol = useCallback(async () => {
        try {
            const amountLinkCall = await handleButtonSimulateBuy();
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFilt: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFilt);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFilt);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            if (programTarget) {
                alert(`You buy your Dev Sol from the vault`);
                let txIntru1 = await programTarget.methods
                    .buySol(amountBN)
                    .accounts({
                        donator: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        vaultsol: pda,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                let transaction = new Transaction().add(txIntru1);
                if (input !== "") {
                    const result = await handleButtonUserMessageLinkCall();
                    if (result instanceof TransactionInstruction) {
                        let intru2: TransactionInstruction | null = null;
                        intru2 = result;
                        transaction.add(intru2);
                    }
                }
                await finalTransaction(false, transaction, connection);
                alert(`You has been buyed your Dev Sol from the vault successful`);
            }
            return amountLinkCall;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [handleButtonSimulateBuy, publicKey, endpoint, input2, programTarget, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonBuySolTarget = useCallback(async () => {
        try {
            const amountLinkCall = await handleButtonSimulateBuy();
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFilt: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFilt);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFilt);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            if (programTarget) {
                alert(`You buy your Dev Sol from the vault`);
                let txIntru1 = await programTarget.methods
                    .buySol(amountBN)
                    .accounts({
                        donator: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        vaultsol: pda,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                let transaction = new Transaction().add(txIntru1);
                const result = await handleButtonTransferSolLinkCall(amount);
                if (result instanceof TransactionInstruction) {
                    let intru2: TransactionInstruction | null = null;
                    intru2 = result;
                    transaction.add(intru2);
                }
                if (input !== "") {
                    const result = await handleButtonUserMessageTargetLinkCall(new PublicKey(String(targetAddress).valueOf()));
                    if (result instanceof TransactionInstruction) {
                        let intru3: TransactionInstruction | null = null;
                        intru3 = result;
                        transaction.add(intru3);
                    }
                }
                await finalTransaction(true, transaction, connection);
                alert(`You has been buyed your Dev Sol from the vault successful`);
            }
            return amountLinkCall;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [handleButtonSimulateBuy, publicKey, endpoint, input2, programTarget, handleButtonTransferSolLinkCall, input, finalTransaction, handleButtonUserMessageTargetLinkCall, targetAddress]);
    const handleButtonBuySolLC = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFilt: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFilt);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFilt);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            if (programTarget) {
                alert(`You buy your Dev Sol from the vault`);
                let txHash: TransactionInstruction = await programTarget.methods
                    .buySol(amountBN)
                    .accounts({
                        donator: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        vaultsol: pda,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction()
                return txHash;
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, endpoint, input2, programTarget]);
    const handleButtonTributeLP = useCallback(async () => {
        try {
            const amountLinkCall = await handleButtonSimulateBurnLP();
            let mintString = "8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He";
            let mint = new PublicKey(mintString);
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFiltSFC: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltSFC);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFiltSFC);
            const tokenFiltLP: TokenAccountsFilter = {
                mint: new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc3 = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltLP);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            const bumpBN = new BN(bump);
            let ratio = Number(poolRatio).valueOf();
            let realratio = ratio * LAMPORTS_PER_SOL;
            const ratioBN = new BN(realratio);
            if (programTarget) {
                alert(`You withdrawing your liquidity from the vault`);
                let txIntru1 = await programTarget.methods
                    .withdrawLiquidity(amountBN, ratioBN, bumpBN)
                    .accounts({
                        donatorsfc: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        donatorlp: tokenAcc3.value[0].pubkey,
                        vaultsol: pda,
                        mint: mint,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                let transaction = new Transaction().add(txIntru1);
                if (input !== "") {
                    const result = await handleButtonUserMessageLinkCall();
                    if (result instanceof TransactionInstruction) {
                        let intru2: TransactionInstruction | null = null;
                        intru2 = result;
                        transaction.add(intru2);
                    }
                }
                await finalTransaction(false, transaction, connection);
                alert(`You has been withdrawed your Sol from the vault successful`);
            }
            return amountLinkCall;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [handleButtonSimulateBurnLP, publicKey, endpoint, input2, poolRatio, programTarget, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonTributeLPTarget = useCallback(async () => {
        try {
            const amountLinkCall = await handleButtonSimulateBurnLP();
            let mintString = "8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He";
            let mint = new PublicKey(mintString);
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFiltSFC: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltSFC);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFiltSFC);
            const tokenFiltLP: TokenAccountsFilter = {
                mint: new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc3 = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltLP);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            const bumpBN = new BN(bump);
            let ratio = Number(poolRatio).valueOf();
            let realratio = ratio * LAMPORTS_PER_SOL;
            const ratioBN = new BN(realratio);
            if (programTarget) {
                alert(`You withdrawing your liquidity from the vault`);
                let txIntru1 = await programTarget.methods
                    .withdrawLiquidity(amountBN, ratioBN, bumpBN)
                    .accounts({
                        donatorsfc: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        donatorlp: tokenAcc3.value[0].pubkey,
                        vaultsol: pda,
                        mint: mint,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                let transaction = new Transaction().add(txIntru1);
                const result1 = await handleButtonTransferSFCLinkCall(Number(amountLinkCall).valueOf());
                if (result1 instanceof TransactionInstruction) {
                    let intru2: TransactionInstruction | null = null;
                    intru2 = result1;
                    transaction.add(intru2);
                }
                const result2 = await handleButtonTransferSolLinkCall(Number(await handleButtonSimulateBurnLPPlus()).valueOf());
                if (result2 instanceof TransactionInstruction) {
                    let intru3: TransactionInstruction | null = null;
                    intru3 = result2;
                    transaction.add(intru3);
                }
                if (input !== "") {
                    const result = await handleButtonUserMessageLinkCall();
                    if (result instanceof TransactionInstruction) {
                        let intru4: TransactionInstruction | null = null;
                        intru4 = result;
                        transaction.add(intru4);
                    }
                }
                await finalTransaction(true, transaction, connection);
                alert(`You has been withdrawed your Sol from the vault successful`);
            }
            return amountLinkCall;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [handleButtonSimulateBurnLP, publicKey, endpoint, input2, poolRatio, programTarget, handleButtonTransferSFCLinkCall, handleButtonTransferSolLinkCall, handleButtonSimulateBurnLPPlus, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonTributeLPLC = useCallback(async () => {
        try {
            let mintString = "8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He";
            let mint = new PublicKey(mintString);
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFiltSFC: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltSFC);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFiltSFC);
            const tokenFiltLP: TokenAccountsFilter = {
                mint: new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc3 = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltLP);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            const bumpBN = new BN(bump);
            let ratio = Number(poolRatio).valueOf();
            let realratio = ratio * LAMPORTS_PER_SOL;
            const ratioBN = new BN(realratio);
            if (programTarget) {
                let txHash: TransactionInstruction = await programTarget.methods
                    .withdrawLiquidity(amountBN, ratioBN, bumpBN)
                    .accounts({
                        donatorsfc: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        donatorlp: tokenAcc3.value[0].pubkey,
                        vaultsol: pda,
                        mint: mint,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                return txHash;
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, endpoint, input2, poolRatio, programTarget]);
    const handleButtonSellSol = useCallback(async () => {
        try {
            const amountLinkCall = await handleButtonSimulateSell();
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFilt: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFilt);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFilt);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            const bumpBN = new BN(bump);
            if (programTarget) {
                alert(`You selling your Sol from the vault`);
                let txIntru1 = await programTarget.methods
                    .sellSol(amountBN, bumpBN)
                    .accounts({
                        donator: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        vaultsol: pda,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                let transaction = new Transaction().add(txIntru1);
                if (input !== "") {
                    const result = await handleButtonUserMessageLinkCall();
                    if (result instanceof TransactionInstruction) {
                        let intru2: TransactionInstruction | null = null;
                        intru2 = result;
                        transaction.add(intru2);
                    }
                }
                await finalTransaction(false, transaction, connection);
                alert(`You has been selled your Sol from the vault successful`);
            }
            return amountLinkCall;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [handleButtonSimulateSell, publicKey, endpoint, input2, programTarget, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonSellSolTarget = useCallback(async () => {
        try {
            const amountLinkCall = await handleButtonSimulateSell();
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFilt: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFilt);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFilt);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            const bumpBN = new BN(bump);
            if (programTarget) {
                alert(`You selling your Sol from the vault`);
                let txIntru1 = await programTarget.methods
                    .sellSol(amountBN, bumpBN)
                    .accounts({
                        donator: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        vaultsol: pda,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                let transaction = new Transaction().add(txIntru1);
                const result = await handleButtonTransferSFCLinkCall(Number(amountLinkCall).valueOf());
                if (result instanceof TransactionInstruction) {
                    let intru2: TransactionInstruction | null = null;
                    intru2 = result;
                    transaction.add(intru2);
                }
                if (input !== "") {
                    const result = await handleButtonUserMessageTargetLinkCall(new PublicKey(String(targetAddress).valueOf()));
                    if (result instanceof TransactionInstruction) {
                        let intru3: TransactionInstruction | null = null;
                        intru3 = result;
                        transaction.add(intru3);
                    }
                }
                await finalTransaction(true, transaction, connection);
                alert(`You has been selled your Sol from the vault successful`);
            }
            return amountLinkCall;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [handleButtonSimulateSell, publicKey, endpoint, input2, programTarget, handleButtonTransferSFCLinkCall, input, finalTransaction, handleButtonUserMessageTargetLinkCall, targetAddress]);
    const handleButtonSellSolLC = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            const tokenFilt: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFilt);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(pda, tokenFilt);
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            const bumpBN = new BN(bump);
            if (programTarget) {
                let txHash: TransactionInstruction = await programTarget.methods
                    .sellSol(amountBN, bumpBN)
                    .accounts({
                        donator: tokenAcc.value[0].pubkey,
                        vaultsfc: tokenAcc2.value[0].pubkey,
                        vaultsol: pda,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction()
                return txHash;
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, endpoint, input2, programTarget]);
    /*const handleButtonSummonSol = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const connection = new Connection(endpoint, 'finalized');
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            Program.fetchIdl("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                .then(async (IDL) => {
                    if (IDL === null) {
                        console.error("Error: IDL not found");
                    } else {
                        alert(`You summoning your Sol from the vault`);
                        const programTarget = new Program(IDL, new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX"), getProvider());
                        let txHash = await programTarget.methods
                            .summonSol(amountBN)
                            .accounts({
                                vault: pda,
                                signer: thatPubkey,
                            })
                            .rpc();
                        await connection.confirmTransaction(txHash);
                        alert(`You has been summoned your Sol from the vault successful`);
                        finalTransaction(txHash, false);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching IDL: ", error);
                    alert(error.message);
                });
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, endpoint, input2, fetchBalance]);
    const handleButtonTributeStable = useCallback(async () => {
        try {
            const [vaultDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            };
            const connection = new Connection(endpoint, 'finalized');
            const tokenFilt: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFilt);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(vaultDataPda, tokenFilt);
            try {
                let amount = Number(input2).valueOf();
                let realamount = amount * LAMPORTS_PER_SOL;
                const amountBN = new BN(realamount);
                Program.fetchIdl("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    .then(async (IDL) => {
                        if (IDL === null) {
                            console.error("Error: IDL not found");
                        } else {
                            alert(`You tributing your SFC - VND to the Vault`);
                            const programTarget = new Program(IDL, new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX"), getProvider());
                            let txHash = await programTarget.methods
                                .tributeStable(amountBN)
                                .accounts({
                                    donator: tokenAcc.value[0].pubkey,
                                    vault: tokenAcc2.value[0].pubkey,
                                    signer: thatPubkey,
                                    token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                                })
                                .rpc();
                            await connection.confirmTransaction(txHash);
                            alert(`You has been tributed your SFC - VND to the Vault successful`);
                            finalTransaction(txHash, false);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching inner IDL: ", error);
                        alert(error.message);
                    });

            } catch (e) {
                console.log(`${e}`);
                alert(e);
            }
        } catch (error) {
            console.error("Error fetching outer IDL: ", error);
            alert(error.message);
        }
    }, [publicKey, endpoint, input2, fetchBalance]);
    const handleButtonTributeSol = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const connection = new Connection(endpoint, 'finalized');
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let amount = Number(input2).valueOf();
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            Program.fetchIdl("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                .then(async (IDL) => {
                    if (IDL === null) {
                        console.error("Error: IDL not found");
                    } else {
                        alert(`You tributing your Sol to the vault`);
                        const programTarget = new Program(IDL, new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX"), getProvider());
                        let txHash = await programTarget.methods
                            .tributeSol(amountBN)
                            .accounts({
                                vault: pda,
                                signer: thatPubkey,
                                systemProgram: SystemProgram.programId,
                            })
                            .rpc();
                        await connection.confirmTransaction(txHash);
                        alert(`You has been tributed your Sol to the vault successful`);
                        finalTransaction(txHash, false);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching IDL: ", error);
                    alert(error.message);
                });
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, endpoint, input2, fetchBalance]);
    const handleButtonSummonStable = useCallback(async () => {
        try {
            const [vaultDataPda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            };
            const connection = new Connection(endpoint, 'finalized');
            const tokenFilt: TokenAccountsFilter = {
                mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            };
            const tokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFilt);
            const tokenAcc2 = await connection.getParsedTokenAccountsByOwner(vaultDataPda, tokenFilt);
            try {
                let amount: number = Number(input2).valueOf();
                let realamount = amount * LAMPORTS_PER_SOL;
                const amountBN = new BN(realamount);
                const bumpBN = new BN(bump);
                Program.fetchIdl("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    .then(async (IDL) => {
                        if (IDL === null) {
                            console.error("Error: IDL not found");
                        } else {
                            alert(`You summoning your SFC - VND from the Vault`);
                            const programTarget = new Program(IDL, new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX"), getProvider());
                            let txHash = await programTarget.methods
                                .summonStable(amountBN, bumpBN)
                                .accounts({
                                    donator: tokenAcc.value[0].pubkey,
                                    vault: tokenAcc2.value[0].pubkey,
                                    authority: vaultDataPda,
                                    signer: thatPubkey,
                                    token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                                })
                                .rpc();
                            await connection.confirmTransaction(txHash);
                            alert(`You has been summoned your SFC - VND from the Vault successful`);
                            finalTransaction(txHash, false);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching inner IDL: ", error);
                        alert(error.message);
                    });

            } catch (e) {
                console.log(`${e}`);
                alert(e);
            }
        } catch (error) {
            console.error("Error fetching outer IDL: ", error);
            alert(error.message);
        }
    }, [publicKey, endpoint, input2, fetchBalance]);*/
    const handleButtonUserMessageTarget = useCallback(async () => {
        let txIntru: TransactionInstruction;
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let accountTarget: any;
            let targetKey: any;
            async function processAccountTarget() {
                if (accountTarget !== undefined) {
                    targetKey = accountTarget.assetTarget;
                    if (accountTarget.assetTarget !== input3 && input3 !== "") {
                        targetKey = input3;
                    } else {
                        targetKey = accountTarget.assetTarget;
                    }
                    const [toDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("client", "utf8"), targetKey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const [targetDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const [fromDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const connection = new Connection(endpoint, 'finalized');
                    try {
                        if (programTarget) {
                            alert(`You sending message to this target`);
                            txIntru = await programTarget.methods
                                .userMessageTarget(input)
                                .accounts({
                                    target: targetDataPda,
                                    fromclient: fromDataPda,
                                    toclient: toDataPda,
                                    signer: thatPubkey,
                                })
                                .instruction();
                            let transaction = new Transaction().add(txIntru);
                            await finalTransaction(true, transaction, connection);
                            alert(`You has been sended message to this target successful`);
                        }
                    } catch (e) {
                        console.log(`${e}`);
                        alert(e);
                    }
                }
            }
            if (programTarget) {
                programTarget.account.userTarget.fetch(pda3)
                    .then(target => {
                        accountTarget = target;
                        processAccountTarget();
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint, input, finalTransaction]);
    const handleButtonUserMessage = useCallback(async () => {
        let txIntru: TransactionInstruction;
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda2] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            if (programTarget) {
                alert(`You sending message to everyone`);
                txIntru = await programTarget.methods
                    .userMessage(input)
                    .accounts({
                        client: pda2,
                        signer: thatPubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                let transaction = new Transaction().add(txIntru);
                await finalTransaction(false, transaction, connection);
                alert(`You has been sended message to everyone successful`);
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, endpoint, programTarget, input, finalTransaction]);
    const handleButtonChangeNameTarget = useCallback(async () => {
        let txIntru: TransactionInstruction;
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let accountTarget: any;
            let targetKey: any;
            async function processAccountTarget() {
                if (accountTarget !== undefined) {
                    if (accountTarget.assetTarget !== input3 && input3 !== "") {
                        targetKey = input3;
                    } else {
                        targetKey = accountTarget.assetTarget;
                    }
                    const [playerDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("client", "utf8"), targetKey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const connection = new Connection(endpoint, 'finalized');
                    const [targetDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    try {
                        if (programTarget) {
                            alert(`You changing the name of this target`);
                            txIntru = await programTarget.methods
                                .changeNameTarget(input)
                                .accounts({
                                    target: targetDataPda,
                                    client: playerDataPda,
                                    signer: thatPubkey,
                                })
                                .instruction();
                            let transaction = new Transaction().add(txIntru);
                            await finalTransaction(true, transaction, connection);
                            alert(`You has been changed the name of this target successful`);
                        }
                    } catch (e) {
                        console.log(`${e}`);
                        alert(e);
                    }
                }
            }
            if (programTarget) {
                programTarget.account.userTarget.fetch(pda3)
                    .then(target => {
                        accountTarget = target;
                        processAccountTarget();
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint, input, finalTransaction]);
    const handleButtonChangeName = useCallback(async () => {
        let txIntru: TransactionInstruction;
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda2] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            if (programTarget) {
                alert(`Your account name changing`);
                txIntru = await programTarget.methods
                    .changeName(input)
                    .accounts({
                        client: pda2,
                        signer: thatPubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                let transaction = new Transaction().add(txIntru);
                await finalTransaction(false, transaction, connection);
                alert(`Your account name changed successful`);
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, endpoint, programTarget, input, finalTransaction]);
    const handleButtonOpenAssetAcc = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda2] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            if (programTarget) {
                try {
                    await programTarget.account.userInfor.fetch(pda2);
                    alert(`Your asset account opened`);
                } catch (e) {
                    alert(`Your asset account opening`);
                    let txIntru1 = await programTarget.methods
                        .initUser()
                        .accounts({
                            client: pda2,
                            signer: thatPubkey,
                            systemProgram: SystemProgram.programId,
                        })
                        .instruction();
                    let transaction = new Transaction().add(txIntru1);
                    if (input !== "") {
                        const result = await handleButtonUserMessageLinkCall();
                        if (result instanceof TransactionInstruction) {
                            let intru2: TransactionInstruction | null = null;
                            intru2 = result;
                            transaction.add(intru2);
                        }
                    }
                    await finalTransaction(false, transaction, connection);
                    alert(`Your asset account opened successful`);
                }
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, endpoint, programTarget, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonOpenTokenAcc = useCallback(async () => {
        try {
            let mintString = "4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ";
            let mint = new PublicKey(mintString);
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const connection = new Connection(endpoint, 'finalized');
            const tokenAccount = getAssociatedTokenAddressSync(
                mint,
                thatPubkey
            );
            const ataInfo = await connection.getAccountInfo(tokenAccount);
            if (ataInfo === null) {
                const ataInstruction = createAssociatedTokenAccountInstruction(
                    thatPubkey,
                    tokenAccount,
                    thatPubkey,
                    mint
                );
                const transaction = new Transaction().add(ataInstruction);
                if (input !== "") {
                    const result = await handleButtonUserMessageLinkCall();
                    if (result instanceof TransactionInstruction) {
                        let intru2: TransactionInstruction | null = null;
                        intru2 = result;
                        transaction.add(intru2);
                    }
                }
                alert(`Token account opening`);
                await finalTransaction(false, transaction, connection);
                alert(`Token account opened successful`);
            } else {
                alert(`Token account already exists`);
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, endpoint, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonOpenLPAcc = useCallback(async () => {
        try {
            let mintString = "8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He";
            let mint = new PublicKey(mintString);
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const connection = new Connection(endpoint, 'finalized');
            const tokenAccount = getAssociatedTokenAddressSync(
                mint,
                thatPubkey
            );
            const ataInfo = await connection.getAccountInfo(tokenAccount);
            if (ataInfo === null) {
                const ataInstruction = createAssociatedTokenAccountInstruction(
                    thatPubkey,
                    tokenAccount,
                    thatPubkey,
                    mint
                );
                const transaction = new Transaction().add(ataInstruction);
                if (input !== "") {
                    const result = await handleButtonUserMessageLinkCall();
                    if (result instanceof TransactionInstruction) {
                        let intru2: TransactionInstruction | null = null;
                        intru2 = result;
                        transaction.add(intru2);
                    }
                }
                alert(`LP token account opening`);
                await finalTransaction(false, transaction, connection);
                alert(`LP token account opened successful`);
            } else {
                alert(`LP token account already exists`);
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, endpoint, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonCloseAssetAcc = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            if (walletAsset !== 0) {
                alert(`Your asset account not empty`);
                return;
            } else {
                if (programTarget) {
                    alert(`Your asset account closing`);
                    let txIntru1 = await programTarget.methods
                        .clearUser()
                        .accounts({
                            client: pda,
                            signer: thatPubkey,
                        })
                        .instruction();
                    let transaction = new Transaction().add(txIntru1);
                    if (input !== "") {
                        const result = await handleButtonUserMessageLinkCall();
                        if (result instanceof TransactionInstruction) {
                            let intru2: TransactionInstruction | null = null;
                            intru2 = result;
                            transaction.add(intru2);
                        }
                    }
                    await finalTransaction(false, transaction, connection);
                    alert(`Your asset account closed successful`);
                }
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, endpoint, walletAsset, programTarget, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonLockTarget = useCallback(async () => {
        try {
            let targetKeyString = input;
            let targetKey = new PublicKey(targetKeyString);
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [targetDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            if (programTarget) {
                alert(`You locking to this target`);
                let txIntru = await programTarget.methods
                    .lockTarget(targetKey)
                    .accounts({
                        target: targetDataPda,
                        signer: thatPubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                let transaction = new Transaction().add(txIntru);
                await finalTransaction(true, transaction, connection);
                alert(`You has been lock to this target successful`);
            }
        } catch (error) {
            alert(error.message);
        }
    }, [input, publicKey, endpoint, programTarget, finalTransaction]);
    const handleButtonTransferSFC = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let accountTarget: any;
            let targetKey: any;
            async function processAccountTarget() {
                if (accountTarget !== undefined) {
                    if (accountTarget.assetTarget !== input3 && input3 !== "") {
                        targetKey = input3;
                    } else {
                        targetKey = accountTarget.assetTarget;
                    }
                    const connection = new Connection(endpoint, 'finalized');
                    const tokenFiltSFC: TokenAccountsFilter = {
                        mint: new PublicKey("4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ"),
                        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                    };
                    const fromTokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltSFC);
                    const toTokenAcc = await connection.getParsedTokenAccountsByOwner(targetKey, tokenFiltSFC);
                    try {
                        let amount = Number(input2).valueOf();
                        let realamount = amount * LAMPORTS_PER_SOL;
                        const amountBN = new BN(realamount);
                        if (programTarget) {
                            alert(`You transfering to this target`);
                            let txIntru1 = await programTarget.methods
                                .tranferToken(amountBN, true)
                                .accounts({
                                    token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                                    fromtoken: fromTokenAcc.value[0].pubkey,
                                    totoken: toTokenAcc.value[0].pubkey,
                                    signer: thatPubkey,
                                })
                                .instruction();
                            let transaction = new Transaction().add(txIntru1);
                            if (input !== "") {
                                const result = await handleButtonUserMessageTargetLinkCall(targetKey);
                                if (result instanceof TransactionInstruction) {
                                    let intru2: TransactionInstruction | null = null;
                                    intru2 = result;
                                    transaction.add(intru2);
                                }
                            }
                            await finalTransaction(true, transaction, connection);
                            alert(`You has been transfered to this target successful`);
                        }
                    } catch (e) {
                        console.log(`${e}`);
                        alert(e);
                    }
                }
            }
            if (programTarget) {
                programTarget.account.userTarget.fetch(pda3)
                    .then(target => {
                        accountTarget = target;
                        processAccountTarget();
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
            }

        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint, input2, input, finalTransaction, handleButtonUserMessageTargetLinkCall]);
    const handleButtonTransferLP = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let accountTarget: any;
            let targetKey: any;
            async function processAccountTarget() {
                if (accountTarget !== undefined) {
                    if (accountTarget.assetTarget !== input3 && input3 !== "") {
                        targetKey = input3;
                    } else {
                        targetKey = accountTarget.assetTarget;
                    }
                    const connection = new Connection(endpoint, 'finalized');
                    const tokenFiltSFC: TokenAccountsFilter = {
                        mint: new PublicKey("8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He"),
                        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                    };
                    const fromTokenAcc = await connection.getParsedTokenAccountsByOwner(thatPubkey, tokenFiltSFC);
                    const toTokenAcc = await connection.getParsedTokenAccountsByOwner(targetKey, tokenFiltSFC);
                    try {
                        let amount = Number(input2).valueOf();
                        let realamount = amount * LAMPORTS_PER_SOL;
                        const amountBN = new BN(realamount);
                        if (programTarget) {
                            alert(`You transfering to this target`);
                            let txIntru1 = await programTarget.methods
                                .tranferToken(amountBN, false)
                                .accounts({
                                    token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                                    fromtoken: fromTokenAcc.value[0].pubkey,
                                    totoken: toTokenAcc.value[0].pubkey,
                                    signer: thatPubkey,
                                })
                                .instruction();
                            let transaction = new Transaction().add(txIntru1);
                            if (input !== "") {
                                const result = await handleButtonUserMessageTargetLinkCall(targetKey);
                                if (result instanceof TransactionInstruction) {
                                    let intru2: TransactionInstruction | null = null;
                                    intru2 = result;
                                    transaction.add(intru2);
                                }
                            }
                            await finalTransaction(true, transaction, connection);
                            alert(`You has been transfered to this target successful`);
                        }
                    } catch (e) {
                        console.log(`${e}`);
                        alert(e);
                    }
                }
            }
            if (programTarget) {
                programTarget.account.userTarget.fetch(pda3)
                    .then(target => {
                        accountTarget = target;
                        processAccountTarget();
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
            }

        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint, input2, input, finalTransaction, handleButtonUserMessageTargetLinkCall]);
    const handleButtonTransferAsset = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let accountTarget: any;
            let targetKey: any;
            async function processAccountTarget() {
                if (accountTarget !== undefined) {
                    if (accountTarget.assetTarget !== input3 && input3 !== "") {
                        targetKey = input3;
                    } else {
                        targetKey = accountTarget.assetTarget;
                    }
                    const [toDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("client", "utf8"), targetKey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const [targetDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const [fromDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const connection = new Connection(endpoint, 'finalized');
                    try {
                        let amount = Number(input2).valueOf();
                        const amountBN = new BN(amount);
                        if (programTarget) {
                            alert(`You transfering to this target`);
                            let txIntru1 = await programTarget.methods
                                .tranferAsset(amountBN)
                                .accounts({
                                    target: targetDataPda,
                                    fromclient: fromDataPda,
                                    toclient: toDataPda,
                                    signer: thatPubkey,
                                })
                                .instruction();
                            let transaction = new Transaction().add(txIntru1);
                            if (input !== "") {
                                const result = await handleButtonUserMessageTargetLinkCall(targetKey);
                                if (result instanceof TransactionInstruction) {
                                    let intru2: TransactionInstruction | null = null;
                                    intru2 = result;
                                    transaction.add(intru2);
                                }
                            }
                            await finalTransaction(true, transaction, connection);
                            alert(`You has been transfered to this target successful`);
                        }
                    } catch (e) {
                        console.log(`${e}`);
                        alert(e);
                    }
                }
            }
            if (programTarget) {
                programTarget.account.userTarget.fetch(pda3)
                    .then(target => {
                        accountTarget = target;
                        processAccountTarget();
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint, input2, input, finalTransaction, handleButtonUserMessageTargetLinkCall]);
    const handleButtonDepositAsset = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let accountTarget: any;
            let targetKey: any;
            async function processAccountTarget() {
                if (accountTarget !== undefined) {
                    if (accountTarget.assetTarget !== input3 && input3 !== "") {
                        targetKey = input3;
                    } else {
                        targetKey = accountTarget.assetTarget;
                    }
                    const [playerDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("client", "utf8"), targetKey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const connection = new Connection(endpoint, 'finalized');
                    const [targetDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    try {
                        let amount = Number(input2).valueOf();
                        const amountBN = new BN(amount);
                        if (programTarget) {
                            alert(`You depositing to this target`);
                            let txIntru1 = await programTarget.methods
                                .depositAsset(amountBN)
                                .accounts({
                                    target: targetDataPda,
                                    client: playerDataPda,
                                    signer: thatPubkey,
                                })
                                .instruction();
                            let transaction = new Transaction().add(txIntru1);
                            if (input !== "") {
                                const result = await handleButtonUserMessageTargetLinkCall(targetKey);
                                if (result instanceof TransactionInstruction) {
                                    let intru2: TransactionInstruction | null = null;
                                    intru2 = result;
                                    transaction.add(intru2);
                                }
                            }
                            await finalTransaction(true, transaction, connection);
                            alert(`You has been deposited to this target successful`);
                        }
                    } catch (e) {
                        console.log(`${e}`);
                        alert(e);
                    }
                }
            }
            if (programTarget) {
                programTarget.account.userTarget.fetch(pda3)
                    .then(target => {
                        accountTarget = target;
                        processAccountTarget();
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
            }

        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint, input2, input, finalTransaction, handleButtonUserMessageTargetLinkCall]);
    const handleButtonWithdrawAsset = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let accountTarget: any;
            let targetKey: any;
            async function processAccountTarget() {
                if (accountTarget !== undefined) {
                    if (accountTarget.assetTarget !== input3 && input3 !== "") {
                        targetKey = input3;
                    } else {
                        targetKey = accountTarget.assetTarget;
                    }
                    const [playerDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("client", "utf8"), targetKey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const [targetDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const connection = new Connection(endpoint, 'finalized');
                    try {
                        let amount: number = Number(input2).valueOf();
                        const amountBN = new BN(amount);
                        if (programTarget) {
                            alert(`You withdrawing from this target`);
                            let txIntru1 = await programTarget.methods
                                .withdrawAsset(amountBN)
                                .accounts({
                                    target: targetDataPda,
                                    client: playerDataPda,
                                    signer: thatPubkey,
                                })
                                .instruction();
                            let transaction = new Transaction().add(txIntru1);
                            if (input !== "") {
                                const result = await handleButtonUserMessageTargetLinkCall(targetKey);
                                if (result instanceof TransactionInstruction) {
                                    let intru2: TransactionInstruction | null = null;
                                    intru2 = result;
                                    transaction.add(intru2);
                                }
                            }
                            await finalTransaction(true, transaction, connection);
                            alert(`You has been withdrawed from this target`);
                        }
                    } catch (e) {
                        console.log(`${e}`);
                        alert(e);
                    }
                }
            }
            if (programTarget) {
                programTarget.account.userTarget.fetch(pda3)
                    .then(target => {
                        accountTarget = target;
                        processAccountTarget();
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
            }
        } catch (error) {
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint, input2, input, finalTransaction, handleButtonUserMessageTargetLinkCall]);
    const handleButtonTributeAsset = useCallback(async () => {
        try {
            let mintString = "4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ";
            let mint = new PublicKey(mintString);
            const [vaultDataPda, bump1] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            };
            const [donatorDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            let thatWallet: any;
            if (wallet && wallet.wallet) {
                thatWallet = wallet
            } else {
                console.error('You not yet choose wallet');
            }
            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                thatWallet,
                mint,
                thatPubkey
            )
            try {
                let amount: number = Number(input2).valueOf();
                let realamount = amount * LAMPORTS_PER_SOL;
                const amountBN = new BN(realamount);
                const bumpBN = new BN(bump1);
                if (programTarget) {
                    alert(`You tributing your asset to the Vault`);
                    let txIntru1 = await programTarget.methods
                        .tributeAsset(amountBN, bumpBN)
                        .accounts({
                            mint: mint,
                            tk: tokenAccount.address,
                            donator: donatorDataPda,
                            vault: vaultDataPda,
                            signer: thatPubkey,
                            token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                            authority: vaultDataPda
                        })
                        .instruction();
                    let transaction = new Transaction().add(txIntru1);
                    if (input !== "") {
                        const result = await handleButtonUserMessageLinkCall();
                        if (result instanceof TransactionInstruction) {
                            let intru2: TransactionInstruction | null = null;
                            intru2 = result;
                            transaction.add(intru2);
                        }
                    }
                    await finalTransaction(false, transaction, connection);
                    alert(`You has been tributed your asset successful`);
                }

            } catch (e) {
                console.log(`${e}`);
                alert(e);
            }
        } catch (error) {
            console.error("Error fetching outer IDL: ", error);
            alert(error.message);
        }
    }, [publicKey, endpoint, wallet, input2, programTarget, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonTributeAssetLinkCall = useCallback(async (amountLinkCall: number) => {
        try {
            let mintString = "4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ";
            let mint = new PublicKey(mintString);
            const [vaultDataPda, bump1] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            };
            const [donatorDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            let thatWallet: any;
            if (wallet && wallet.wallet) {
                thatWallet = wallet
            } else {
                console.error('You not yet choose wallet');
            }
            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                thatWallet,
                mint,
                thatPubkey
            )
            try {
                let amount = amountLinkCall;
                let realamount = amount * LAMPORTS_PER_SOL;
                const amountBN = new BN(realamount);
                const bumpBN = new BN(bump1);
                if (programTarget) {
                    let txHash: TransactionInstruction = await programTarget.methods
                        .tributeAsset(amountBN, bumpBN)
                        .accounts({
                            mint: mint,
                            tk: tokenAccount.address,
                            donator: donatorDataPda,
                            vault: vaultDataPda,
                            signer: thatPubkey,
                            token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                            authority: vaultDataPda
                        })
                        .instruction();
                    return txHash;
                }
            } catch (e) {
                console.log(`${e}`);
                alert(e);
            }
        } catch (error) {
            console.error("Error fetching outer IDL: ", error);
            alert(error.message);
        }
    }, [publicKey, endpoint, wallet, programTarget]);
    const handleButtonSummonAsset = useCallback(async () => {
        try {
            let mintString = "4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ";
            let mint = new PublicKey(mintString);
            const [vaultDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            };
            const [donatorDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            let thatWallet: any;
            if (wallet && wallet.wallet) {
                thatWallet = wallet
            } else {
                console.error('You not yet choose wallet');
            }
            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                thatWallet,
                mint,
                thatPubkey
            )
            try {
                let amount: number = Number(input2).valueOf();
                let realamount = amount * LAMPORTS_PER_SOL;
                const amountBN = new BN(realamount);
                if (programTarget) {
                    alert(`You summoning your asset from the Vault`);
                    let txIntru1 = await programTarget.methods
                        .summonAsset(amountBN)
                        .accounts({
                            mint: mint,
                            tk: tokenAccount.address,
                            donator: donatorDataPda,
                            vault: vaultDataPda,
                            signer: thatPubkey,
                            token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        })
                        .instruction();
                    let transaction = new Transaction().add(txIntru1);
                    if (input !== "") {
                        const result = await handleButtonUserMessageLinkCall();
                        if (result instanceof TransactionInstruction) {
                            let intru2: TransactionInstruction | null = null;
                            intru2 = result;
                            transaction.add(intru2);
                        }
                    }
                    await finalTransaction(false, transaction, connection);
                    alert(`You summoned your asset from the Vault successful`);
                }
            } catch (e) {
                console.log(`${e}`);
                alert(e);
            }

        } catch (error) {
            console.error("Error fetching outer IDL: ", error);
            alert(error.message);
        }
    }, [publicKey, endpoint, wallet, input2, programTarget, input, finalTransaction, handleButtonUserMessageLinkCall]);
    const handleButtonSummonTargetNew = useCallback(async () => {
        try {
            let mintString = "4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ";
            let mint = new PublicKey(mintString);
            const [vaultDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            };
            const [donatorDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            let thatWallet: any;
            if (wallet && wallet.wallet) {
                thatWallet = wallet
            } else {
                console.error('You not yet choose wallet');
            }
            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                thatWallet,
                mint,
                thatPubkey
            )
            try {
                let amount: number = Number(input2).valueOf();
                let realamount = amount * LAMPORTS_PER_SOL;
                const amountBN = new BN(realamount);
                if (programTarget) {
                    alert(`You summoning your asset from the Vault`);
                    let txIntru1 = await programTarget.methods
                        .summonAsset(amountBN)
                        .accounts({
                            mint: mint,
                            tk: tokenAccount.address,
                            donator: donatorDataPda,
                            vault: vaultDataPda,
                            signer: thatPubkey,
                            token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                        })
                        .instruction();
                    let transaction = new Transaction().add(txIntru1);
                    const result = await handleButtonTransferAssetLinkCall(realamount);
                    if (result instanceof TransactionInstruction) {
                        let intru2: TransactionInstruction | null = null;
                        intru2 = result;
                        transaction.add(intru2);
                    }
                    if (input !== "") {
                        const result = await handleButtonUserMessageTargetLinkCall(new PublicKey(String(targetAddress).valueOf()));
                        if (result instanceof TransactionInstruction) {
                            let intru3: TransactionInstruction | null = null;
                            intru3 = result;
                            transaction.add(intru3);
                        }
                    }
                    await finalTransaction(true, transaction, connection);
                    alert(`You summoned your asset from the Vault successful`);
                }
            } catch (e) {
                console.log(`${e}`);
                alert(e);
            }

        } catch (error) {
            console.error("Error fetching outer IDL: ", error);
            alert(error.message);
        }
    }, [publicKey, endpoint, wallet, input2, programTarget, handleButtonTransferAssetLinkCall, input, finalTransaction, handleButtonUserMessageTargetLinkCall, targetAddress]);
    const handleButtonSummonAssetLinkCall = useCallback(async (amountLinkCall: number) => {
        try {
            let mintString = "4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ";
            let mint = new PublicKey(mintString);
            const [vaultDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault")],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            };
            const [donatorDataPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            const connection = new Connection(endpoint, 'finalized');
            let thatWallet: any;
            if (wallet && wallet.wallet) {
                thatWallet = wallet
            } else {
                console.error('You not yet choose wallet');
            }
            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                thatWallet,
                mint,
                thatPubkey
            )
            let amount = amountLinkCall;
            let realamount = amount * LAMPORTS_PER_SOL;
            const amountBN = new BN(realamount);
            if (programTarget) {
                let txHash: TransactionInstruction = await programTarget.methods
                    .summonAsset(amountBN)
                    .accounts({
                        mint: mint,
                        tk: tokenAccount.address,
                        donator: donatorDataPda,
                        vault: vaultDataPda,
                        signer: thatPubkey,
                        token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                    })
                    .instruction();
                return txHash;
            }
        } catch (error) {
            console.error("Error fetching outer IDL: ", error);
            alert(error.message);
        }
    }, [publicKey, endpoint, wallet, programTarget]);
    const handleButtonTributeTarget = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let accountTarget: any;
            let targetKey: any;
            async function processAccountTarget() {
                if (accountTarget !== undefined) {
                    if (accountTarget.assetTarget !== input3 && input3 !== "") {
                        targetKey = input3;
                    } else {
                        targetKey = accountTarget.assetTarget;
                    }
                    let mintString = "4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ";
                    let mint = new PublicKey(mintString);
                    const [vaultDataPda, bump1] = PublicKey.findProgramAddressSync(
                        [Buffer.from("vault")],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const [donatorDataPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("client", "utf8"), thatPubkey.toBuffer()],
                        new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
                    );
                    const connection = new Connection(endpoint, 'finalized');
                    let thatWallet: any;
                    if (wallet && wallet.wallet) {
                        thatWallet = wallet
                    } else {
                        console.error('You not yet choose wallet');
                    }
                    const tokenAccount = await getOrCreateAssociatedTokenAccount(
                        connection,
                        thatWallet,
                        mint,
                        targetKey
                    )
                    try {
                        let amount: number = Number(input2).valueOf();
                        let realamount = amount * LAMPORTS_PER_SOL;
                        const amountBN = new BN(realamount);
                        const bumpBN = new BN(bump1);
                        if (programTarget) {
                            alert(`You tributing your asset for this target`);
                            let txIntru1 = await programTarget.methods
                                .tributeAsset(amountBN, bumpBN)
                                .accounts({
                                    mint: mint,
                                    tk: tokenAccount.address,
                                    donator: donatorDataPda,
                                    vault: vaultDataPda,
                                    signer: thatPubkey,
                                    token: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                                    authority: vaultDataPda
                                })
                                .instruction();
                            let transaction = new Transaction().add(txIntru1);
                            if (input !== "") {
                                const result = await handleButtonUserMessageTargetLinkCall(targetKey);
                                if (result instanceof TransactionInstruction) {
                                    let intru2: TransactionInstruction | null = null;
                                    intru2 = result;
                                    transaction.add(intru2);
                                }
                            }
                            await finalTransaction(true, transaction, connection);
                            alert(`You has been tributed your asset for this target successful`);
                        }
                    } catch (e) {
                        console.log(`${e}`);
                        alert(e);
                    }
                }
            }
            if (programTarget) {
                programTarget.account.userTarget.fetch(pda3)
                    .then(target => {
                        accountTarget = target;
                        processAccountTarget();
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
            }

        } catch (error) {
            console.error("Error fetching outer IDL: ", error);
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint, wallet, input2, input, finalTransaction, handleButtonUserMessageTargetLinkCall]);
    const handleButtonOpenTokenTarget = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let accountTarget: any;
            let targetKey: any;
            async function processAccountTarget() {
                if (accountTarget !== undefined) {
                    if (accountTarget.assetTarget !== input3 && input3 !== "") {
                        targetKey = input3;
                    } else {
                        targetKey = accountTarget.assetTarget;
                    }
                    let mintString = "4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ";
                    let mint = new PublicKey(mintString);
                    const connection = new Connection(endpoint, 'finalized');
                    const tokenAccount = getAssociatedTokenAddressSync(
                        mint,
                        targetKey
                    );
                    const ataInfo = await connection.getAccountInfo(tokenAccount);
                    if (ataInfo === null) {
                        const ataInstruction = createAssociatedTokenAccountInstruction(
                            thatPubkey,
                            tokenAccount,
                            targetKey,
                            mint
                        );
                        const transaction = new Transaction().add(ataInstruction);
                        if (input !== "") {
                            const result = await handleButtonUserMessageTargetLinkCall(targetKey);
                            if (result instanceof TransactionInstruction) {
                                let intru2: TransactionInstruction | null = null;
                                intru2 = result;
                                transaction.add(intru2);
                            }
                        }
                        alert(`Token account opening`);
                        await finalTransaction(true, transaction, connection);
                        alert(`Token account opened successful`);
                    } else {
                        alert(`Token account already exists`);
                    }
                }
            }
            if (programTarget) {
                programTarget.account.userTarget.fetch(pda3)
                    .then(target => {
                        accountTarget = target;
                        processAccountTarget();
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
            }

        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint, input, finalTransaction, handleButtonUserMessageTargetLinkCall]);
    const handleButtonOpenLPTarget = useCallback(async () => {
        try {
            let thatPubkey: any;
            if (publicKey) {
                thatPubkey = publicKey;
            } else {
                console.error('You not yet choose wallet');
            }
            const [pda3] = PublicKey.findProgramAddressSync(
                [Buffer.from("target", "utf8"), thatPubkey.toBuffer()],
                new PublicKey("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX")
            );
            let accountTarget: any;
            let targetKey: any;
            async function processAccountTarget() {
                if (accountTarget !== undefined) {
                    if (accountTarget.assetTarget !== input3 && input3 !== "") {
                        targetKey = input3;
                    } else {
                        targetKey = accountTarget.assetTarget;
                    }
                    let mintString = "8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He";
                    let mint = new PublicKey(mintString);
                    const connection = new Connection(endpoint, 'finalized');
                    const tokenAccount = getAssociatedTokenAddressSync(
                        mint,
                        targetKey
                    );
                    const ataInfo = await connection.getAccountInfo(tokenAccount);
                    if (ataInfo === null) {
                        const ataInstruction = createAssociatedTokenAccountInstruction(
                            thatPubkey,
                            tokenAccount,
                            targetKey,
                            mint
                        );
                        const transaction = new Transaction().add(ataInstruction);
                        if (input !== "") {
                            const result = await handleButtonUserMessageTargetLinkCall(targetKey);
                            if (result instanceof TransactionInstruction) {
                                let intru2: TransactionInstruction | null = null;
                                intru2 = result;
                                transaction.add(intru2);
                            }
                        }
                        alert(`LP token account opening`);
                        await finalTransaction(true, transaction, connection);
                        alert(`LP token account opened successful`);
                    } else {
                        alert(`LP token account already exists`);
                    }
                }
            }
            if (programTarget) {
                programTarget.account.userTarget.fetch(pda3)
                    .then(target => {
                        accountTarget = target;
                        processAccountTarget();
                    })
                    .catch(error => {
                        console.error('Error fetching account target:', error);
                    });
            }

        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }, [publicKey, programTarget, input3, endpoint, input, finalTransaction, handleButtonUserMessageTargetLinkCall]);
    const handleButtonBuySolLinkCall = useCallback(async () => {
        let intru1: TransactionInstruction | null = null;
        let intru2: TransactionInstruction | null = null;
        await handleButtonSimulateBuy()
            .then(async (amountLinkCall) => {
                if (amountLinkCall) {
                    const result = await handleButtonTributeAssetLinkCall(amountLinkCall);
                    if (result instanceof TransactionInstruction) {
                        intru1 = result;
                    }
                }
            })
            .then(async () => {
                const result = await handleButtonBuySolLC();
                if (result instanceof TransactionInstruction) {
                    intru2 = result;
                }
            })
            .finally(async () => {
                if (intru1 && intru2) {
                    const connection = new Connection(endpoint, 'finalized');
                    const transaction = new Transaction().add(intru1).add(intru2);
                    if (input !== "") {
                        const result = await handleButtonUserMessageLinkCall();
                        if (result instanceof TransactionInstruction) {
                            let intru3: TransactionInstruction | null = null;
                            intru3 = result;
                            transaction.add(intru3);
                        }
                    }
                    alert(`You buying your Dev Sol by VND to the vault successful`);
                    await finalTransaction(false, transaction, connection);
                    alert(`You has been buyed your Dev Sol by VND from the vault successful`);
                } else {
                    console.error('Error: TransactionInstructions not found');
                }
            })
    }, [endpoint, finalTransaction, handleButtonBuySolLC, handleButtonSimulateBuy, handleButtonTributeAssetLinkCall, handleButtonUserMessageLinkCall, input]);
    const handleButtonBuySolLinkCallTarget = useCallback(async () => {
        let intru1: TransactionInstruction | null = null;
        let intru2: TransactionInstruction | null = null;
        let intru3: TransactionInstruction | null = null;
        await handleButtonSimulateBuy()
            .then(async (amountLinkCall) => {
                if (amountLinkCall) {
                    const result = await handleButtonTributeAssetLinkCall(amountLinkCall);
                    if (result instanceof TransactionInstruction) {
                        intru1 = result;
                    }
                }
            })
            .then(async () => {
                const result = await handleButtonBuySolLC();
                if (result instanceof TransactionInstruction) {
                    intru2 = result;
                }
            })
            .then(async () => {
                const result = await handleButtonTransferSolLinkCall(Number(input2).valueOf());
                if (result instanceof TransactionInstruction) {
                    intru3 = result;
                }
            })
            .finally(async () => {
                if (intru1 && intru2 && intru3) {
                    const connection = new Connection(endpoint, 'finalized');
                    const transaction = new Transaction().add(intru1).add(intru2).add(intru3);
                    if (input !== "") {
                        const result = await handleButtonUserMessageTargetLinkCall(new PublicKey(String(targetAddress).valueOf()));
                        if (result instanceof TransactionInstruction) {
                            let intru4: TransactionInstruction | null = null;
                            intru4 = result;
                            transaction.add(intru4);
                        }
                    }
                    alert(`You buying your Dev Sol by VND to the vault successful`);
                    await finalTransaction(true, transaction, connection);
                    alert(`You has been buyed your Dev Sol by VND from the vault successful`);
                } else {
                    console.error('Error: TransactionInstructions not found');
                }
            })
    }, [endpoint, finalTransaction, handleButtonBuySolLC, handleButtonSimulateBuy, handleButtonTransferSolLinkCall, handleButtonTributeAssetLinkCall, handleButtonUserMessageTargetLinkCall, input, input2, targetAddress]);
    const handleButtonSellSolLinkCall = useCallback(async () => {
        let intru1: TransactionInstruction | null = null;
        let intru2: TransactionInstruction | null = null;
        await handleButtonSimulateSell()
            .then(async (amountLinkCall) => {
                if (amountLinkCall) {
                    const result = await handleButtonSummonAssetLinkCall(amountLinkCall);
                    if (result instanceof TransactionInstruction) {
                        intru2 = result;
                    }
                }
            })
            .then(async () => {
                const result = await handleButtonSellSolLC();
                if (result instanceof TransactionInstruction) {
                    intru1 = result;
                }
            })
            .finally(async () => {
                if (intru1 && intru2) {
                    const connection = new Connection(endpoint, 'finalized');
                    const transaction = new Transaction().add(intru1).add(intru2);
                    if (input !== "") {
                        const result = await handleButtonUserMessageLinkCall();
                        if (result instanceof TransactionInstruction) {
                            let intru3: TransactionInstruction | null = null;
                            intru3 = result;
                            transaction.add(intru3);
                        }
                    }
                    alert(`You selling your Dev Sol for VND to the vault successful`);
                    await finalTransaction(false, transaction, connection);
                    alert(`You has been selled your Dev Sol for VND to the vault successful`);
                } else {
                    console.error('Error: TransactionInstructions not found');
                }
            })
    }, [endpoint, finalTransaction, handleButtonSellSolLC, handleButtonSimulateSell, handleButtonSummonAssetLinkCall, handleButtonUserMessageLinkCall, input]);
    const handleButtonSellSolLinkCallTarget = useCallback(async () => {
        let intru1: TransactionInstruction | null = null;
        let intru2: TransactionInstruction | null = null;
        let intru3: TransactionInstruction | null = null;
        await handleButtonSimulateSell()
            .then(async (amountLinkCall) => {
                if (amountLinkCall) {
                    const result = await handleButtonSummonAssetLinkCall(amountLinkCall);
                    if (result instanceof TransactionInstruction) {
                        intru2 = result;
                    }
                }
                return amountLinkCall;
            })
            .then(async (amountLinkCall) => {
                const result = await handleButtonTransferAssetLinkCall(Number(amountLinkCall).valueOf() * LAMPORTS_PER_SOL);
                if (result instanceof TransactionInstruction) {
                    intru3 = result;
                }
            })
            .then(async () => {
                const result = await handleButtonSellSolLC();
                if (result instanceof TransactionInstruction) {
                    intru1 = result;
                }
            })
            .finally(async () => {
                if (intru1 && intru2 && intru3) {
                    const connection = new Connection(endpoint, 'finalized');
                    const transaction = new Transaction().add(intru1).add(intru2).add(intru3);
                    if (input !== "") {
                        const result = await await handleButtonUserMessageTargetLinkCall(new PublicKey(String(targetAddress).valueOf()));
                        if (result instanceof TransactionInstruction) {
                            let intru4: TransactionInstruction | null = null;
                            intru4 = result;
                            transaction.add(intru4);
                        }
                    }
                    alert(`You selling your Dev Sol for VND to the vault successful`);
                    await finalTransaction(true, transaction, connection);
                    alert(`You has been selled your Dev Sol for VND to the vault successful`);
                } else {
                    console.error('Error: TransactionInstructions not found');
                }
            })
    }, [endpoint, finalTransaction, handleButtonSellSolLC, handleButtonSimulateSell, handleButtonSummonAssetLinkCall, handleButtonTransferAssetLinkCall, handleButtonUserMessageTargetLinkCall, input, targetAddress]);
    const handleButtonMintLPLinkCall = useCallback(async () => {
        let intru1: TransactionInstruction | null = null;
        let intru2: TransactionInstruction | null = null;
        await handleButtonSimulateMintLP()
            .then(async (amountLinkCall) => {
                if (amountLinkCall) {
                    const result = await handleButtonTributeAssetLinkCall(amountLinkCall);
                    if (result instanceof TransactionInstruction) {
                        intru1 = result;
                    }
                }
            })
            .then(async () => {
                const result = await handleButtonSummonLPLC();
                if (result instanceof TransactionInstruction) {
                    intru2 = result;
                }
            })
            .finally(async () => {
                if (intru1 && intru2) {
                    const connection = new Connection(endpoint, 'finalized');
                    const transaction = new Transaction().add(intru1).add(intru2);
                    if (input !== "") {
                        const result = await handleButtonUserMessageLinkCall();
                        if (result instanceof TransactionInstruction) {
                            let intru3: TransactionInstruction | null = null;
                            intru3 = result;
                            transaction.add(intru3);
                        }
                    }
                    alert(`You minting your LP by VND from the vault successful`);
                    await finalTransaction(false, transaction, connection);
                    alert(`You has been minted your LP by VND from the vault successful`);
                } else {
                    console.error('Error: TransactionInstructions not found');
                }
            })
    }, [endpoint, finalTransaction, handleButtonSimulateMintLP, handleButtonSummonLPLC, handleButtonTributeAssetLinkCall, handleButtonUserMessageLinkCall, input]);
    const handleButtonMintLPLinkCallTarget = useCallback(async () => {
        let intru1: TransactionInstruction | null = null;
        let intru2: TransactionInstruction | null = null;
        let intru3: TransactionInstruction | null = null;
        await handleButtonSimulateMintLP()
            .then(async (amountLinkCall) => {
                if (amountLinkCall) {
                    const result = await handleButtonTributeAssetLinkCall(amountLinkCall);
                    if (result instanceof TransactionInstruction) {
                        intru1 = result;
                    }
                }
            })
            .then(async () => {
                const result = await handleButtonSummonLPLC();
                if (result instanceof TransactionInstruction) {
                    intru2 = result;
                }
            })
            .then(async () => {
                const result = await handleButtonTransferLPLinkCall(Number(input2).valueOf());
                if (result instanceof TransactionInstruction) {
                    intru3 = result;
                }
            })
            .finally(async () => {
                if (intru1 && intru2 && intru3) {
                    const connection = new Connection(endpoint, 'finalized');
                    const transaction = new Transaction().add(intru1).add(intru2).add(intru3);
                    if (input !== "") {
                        const result = await handleButtonUserMessageTargetLinkCall(new PublicKey(String(targetAddress).valueOf()));
                        if (result instanceof TransactionInstruction) {
                            let intru4: TransactionInstruction | null = null;
                            intru4 = result;
                            transaction.add(intru4);
                        }
                    }
                    alert(`You minting your LP by VND from the vault successful`);
                    await finalTransaction(true, transaction, connection);
                    alert(`You has been minted your LP by VND from the vault successful`);
                } else {
                    console.error('Error: TransactionInstructions not found');
                }
            })
    }, [endpoint, finalTransaction, handleButtonSimulateMintLP, handleButtonSummonLPLC, handleButtonTransferLPLinkCall, handleButtonTributeAssetLinkCall, handleButtonUserMessageTargetLinkCall, input, input2, targetAddress]);
    const handleButtonBurnLPLinkCall = useCallback(async () => {
        let intru1: TransactionInstruction | null = null;
        let intru2: TransactionInstruction | null = null;
        await handleButtonSimulateBurnLP()
            .then(async (amountLinkCall) => {
                if (amountLinkCall) {
                    const result = await handleButtonSummonAssetLinkCall(amountLinkCall);
                    if (result instanceof TransactionInstruction) {
                        intru2 = result;
                    }
                }
            })
            .then(async () => {
                const result = await handleButtonTributeLPLC();
                if (result instanceof TransactionInstruction) {
                    intru1 = result;
                }
            })
            .finally(async () => {
                if (intru1 && intru2) {
                    const connection = new Connection(endpoint, 'finalized');
                    const transaction = new Transaction().add(intru1).add(intru2);
                    if (input !== "") {
                        const result = await handleButtonUserMessageLinkCall();
                        if (result instanceof TransactionInstruction) {
                            let intru3: TransactionInstruction | null = null;
                            intru3 = result;
                            transaction.add(intru3);
                        }
                    }
                    alert(`You burning your LP for VND from the vault successful`);
                    await finalTransaction(false, transaction, connection);
                    alert(`You has been burned your LP for VND from the vault successful`);
                } else {
                    console.error('Error: TransactionInstructions not found');
                }
            })
    }, [endpoint, finalTransaction, handleButtonSimulateBurnLP, handleButtonSummonAssetLinkCall, handleButtonTributeLPLC, handleButtonUserMessageLinkCall, input]);
    const handleButtonBurnLPLinkCallTarget = useCallback(async () => {
        let intru1: TransactionInstruction | null = null;
        let intru2: TransactionInstruction | null = null;
        let intru3: TransactionInstruction | null = null;
        let intru4: TransactionInstruction | null = null;
        await handleButtonSimulateBurnLP()
            .then(async (amountLinkCall) => {
                if (amountLinkCall) {
                    const result = await handleButtonSummonAssetLinkCall(amountLinkCall);
                    if (result instanceof TransactionInstruction) {
                        intru2 = result;
                    }
                }
                return amountLinkCall;
            })
            .then(async (amountLinkCall) => {
                const result = await handleButtonTransferAssetLinkCall(Number(amountLinkCall).valueOf() * LAMPORTS_PER_SOL);
                if (result instanceof TransactionInstruction) {
                    intru3 = result;
                }
            })
            .then(async () => {
                const result = await handleButtonTransferSolLinkCall(Number(await handleButtonSimulateBurnLPPlus()).valueOf());
                if (result instanceof TransactionInstruction) {
                    intru4 = result;
                }
            })
            .then(async () => {
                const result = await handleButtonTributeLPLC();
                if (result instanceof TransactionInstruction) {
                    intru1 = result;
                }
            })
            .finally(async () => {
                if (intru1 && intru2 && intru3 && intru4) {
                    const connection = new Connection(endpoint, 'finalized');
                    const transaction = new Transaction().add(intru1).add(intru2).add(intru3).add(intru4);
                    if (input !== "") {
                        const result = await handleButtonUserMessageTargetLinkCall(new PublicKey(String(targetAddress).valueOf()));
                        if (result instanceof TransactionInstruction) {
                            let intru5: TransactionInstruction | null = null;
                            intru5 = result;
                            transaction.add(intru5);
                        }
                    }
                    alert(`You burning your LP for VND from the vault successful`);
                    await finalTransaction(true, transaction, connection);
                    alert(`You has been burned your LP for VND from the vault successful`);
                } else {
                    console.error('Error: TransactionInstructions not found');
                }
            })
    }, [endpoint, finalTransaction, handleButtonSimulateBurnLP, handleButtonSimulateBurnLPPlus, handleButtonSummonAssetLinkCall, handleButtonTransferAssetLinkCall, handleButtonTransferSolLinkCall, handleButtonTributeLPLC, handleButtonUserMessageTargetLinkCall, input, targetAddress]);
    return (
        <>
            <div>
                <button onClick={switchNonLockTarget} className={Boolean(isNonLockTarget) ? "buttonPress" : ""} >Non Lock</button>
                <button onClick={switchLockTarget} className={(Boolean(isLockTarget)) ? "buttonPress" : ""}>Use Lock</button>
                <input type="text" value={input} onChange={handleInputChange} size={50} />
                <input type="text" value={input3} onChange={handleInputChange3} size={50} />
                {isLockTarget && isNonUseVND && <button onClick={handleButtonClick}>Watch Target</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonLockTarget}>Lock Target</button>}
                {isNonLockTarget && isNonUseVND && <button onClick={fetchBalance}>Watch Mime</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonTransferAsset}>Transfer VND</button>}
                {isLockTarget && isUseVND && <button onClick={handleButtonDepositAsset}>Deposit VND</button>}
                {isLockTarget && isUseVND && <button onClick={handleButtonWithdrawAsset}>Withdraw VND</button>}
                {isNonLockTarget && isNonUseVND && <button onClick={handleButtonOpenTokenAcc}>Open SFC Acc</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonTributeTarget}>Mint SFC</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonSummonTargetNew}>Burn SFC</button>}
                <a href={solanaExplorer?.toString()} target="_blank" rel="noopener noreferrer">
                    <button>
                        Solana Explorer
                    </button>
                </a>
                {/*isNonLockTarget && isNonUseVND && <button onClick={handleButtonTributeSol}>Tribute Dev Sol</button>*/}
                {/*isNonLockTarget && isNonUseVND && <button onClick={handleButtonSummonSol}>Summon Dev Sol</button>*/}
                {isNonLockTarget && isNonUseVND && <button onClick={handleButtonBuySol}>Buy Dev Sol</button>}
                {isNonLockTarget && isNonUseVND && <button onClick={handleButtonSellSol}>Sell Dev Sol</button>}
                {isNonLockTarget && isNonUseVND && <button onClick={handleButtonSummonLP}>Mint LP Token</button>}
                {isNonLockTarget && isNonUseVND && <button onClick={handleButtonTributeLP}>Burn LP Token</button>}
                {isNonLockTarget && isUseVND && <button onClick={handleButtonBuySolLinkCall}>Buy Dev Sol</button>}
                {isNonLockTarget && isUseVND && <button onClick={handleButtonSellSolLinkCall}>Sell Dev Sol</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonBuySolTarget}>Buy Dev Sol</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonSellSolTarget}>Sell Dev Sol</button>}
                {isLockTarget && isUseVND && <button onClick={handleButtonBuySolLinkCallTarget}>Buy Dev Sol</button>}
                {isLockTarget && isUseVND && <button onClick={handleButtonSellSolLinkCallTarget}>Sell Dev Sol</button>}
            </div>
            <div>
                <button onClick={switchNonUseVND} className={Boolean(isNonUseVND) ? "buttonPress" : ""}>Non VND</button>
                <button onClick={switchUseVND} className={Boolean(isUseVND) ? "buttonPress" : ""}>Use VND</button>
                <input type="text" value={input2} onChange={handleInputChange2} size={50} />
                <input type="text" value={input4} onChange={handleInputChange4} size={50} />
                {isNonLockTarget && isNonUseVND && <button onClick={handleButtonOpenAssetAcc}>Open VND Acc</button>}
                {isNonLockTarget && isNonUseVND && <button onClick={handleButtonCloseAssetAcc}>Close VND Acc</button>}
                {isNonLockTarget && isUseVND && <button onClick={handleButtonTributeAsset}>Mint SFC</button>}
                {isNonLockTarget && isUseVND && <button onClick={handleButtonSummonAsset}>Burn SFC</button>}
                {isNonLockTarget && isNonUseVND && <button onClick={handleButtonChangeName}>Change Name</button>}
                {isNonLockTarget && isNonUseVND && <button onClick={handleButtonUserMessage}>User Message</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonOpenTokenTarget}>Open SFC - VND Acc</button>}
                <a href={solScan?.toString()} target="_blank" rel="noopener noreferrer">
                    <button>
                        Solscan Explorer
                    </button>
                </a>
                {isLockTarget && isNonUseVND && <button onClick={handleButtonChangeNameTarget}>Change Name</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonUserMessageTarget}>User Message</button>}
                {/*isNonLockTarget && isNonUseVND &&<button onClick={handleButtonTributeStable}>Tribute Stable</button>*/}
                {/*isNonLockTarget && isNonUseVND &&<button onClick={handleButtonSummonStable}>Summon Stable</button>*/}
                {/*isNonLockTarget && isNonUseVND &&<button onClick={handleButtonSimulateBuy}>Simulate Buy Sol</button>*/}
                {/*isNonLockTarget && isNonUseVND &&<button onClick={handleButtonSimulateSell}>Simulate Sell Sol</button>*/}
                {/*isNonLockTarget && isNonUseVND &&<button onClick={handleButtonSimulateMintLP}>Simulate Mint LP</button>*/}
                {/*isNonLockTarget && isNonUseVND &&<button onClick={handleButtonSimulateBurnLP}>Simulate Burn LP</button>*/}
                {isNonLockTarget && isNonUseVND && <button onClick={handleButtonOpenLPAcc}>Open LP Token Acc</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonOpenLPTarget}>Open LP Token Acc</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonTransferSFC}>Transfer SFC - VND</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonTransferLP}>Transfer LP Token</button>}
                {isNonLockTarget && isUseVND && <button onClick={handleButtonMintLPLinkCall}>Mint LP Token</button>}
                {isNonLockTarget && isUseVND && <button onClick={handleButtonBurnLPLinkCall}>Burn LP Token</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonSummonLPTarget}>Mint LP Token</button>}
                {isLockTarget && isNonUseVND && <button onClick={handleButtonTributeLPTarget}>Burn LP Token</button>}
                {isLockTarget && isUseVND && <button onClick={handleButtonMintLPLinkCallTarget}>Mint LP Token</button>}
                {isLockTarget && isUseVND && <button onClick={handleButtonBurnLPLinkCallTarget}>Burn LP Token</button>}
            </div>
            {isNonTarget && <div className="wallet-info">
                <div>Wallet Address: {walletAddress}</div>
                <div>Account Name: {accountName}</div>
                <div>Target Address: {targetAddress}</div>
                <div>Wallet Balance: {walletBalance} Dev SOL</div>
                <div>Wallet LP Token: {walletLPToken} LPSFC</div>
                <div>Wallet Stable Coin: {walletStableCoin} SFC - VND</div>
                <div>Wallet Asset: {walletAsset} VND</div>
                <div>Stable Coin Supply: {stableCoinSupply} SFC - VND</div>
                <div>Total Asset Base: {totalAssetBase} VND</div>
                <div>LP Token Supply: {lpTokenSupply} LPSFC</div>
                <div>Pool Gas Token: {poolGasToken} Dev SOL</div>
                <div>Pool Stable Coin: {poolStableCoin} SFC - VND</div>
                <div>Pool Ratio Dev Sol 1 : {poolRatio} SFC - VND</div>
                <div>Pool K value: {poolKValue}</div>
                <div>
                    <img src="https://i.ibb.co/vxRnDKx/SFC-VND.jpg" alt="SFC - VND Logo" title='SFC - VND Logo' width="100" height="100" />
                    <img src="https://i.ibb.co/wMRXC4M/LP-Token-Logo.webp" alt="LPSFC Logo" title='LPSFC Logo' width="100" height="100" />
                </div>
            </div>}
            {isTarget && <div className="wallet-info">
                <div>Wallet Address: {walletAddressTarget}</div>
                <div>Account Name: {accountNameTarget}</div>
                <div>Target Address: {targetAddressTarget}</div>
                <div>Wallet Balance: {walletBalanceTarget} Dev SOL</div>
                <div>Wallet LP Token: {walletLPTokenTarget} LPSFC</div>
                <div>Wallet Stable Coin: {walletStableCoinTarget} SFC - VND</div>
                <div>Wallet Asset: {walletAssetTarget} VND</div>
                <div>Stable Coin Supply: {stableCoinSupply} SFC - VND</div>
                <div>Total Asset Base: {totalAssetBase} VND</div>
                <div>LP Token Supply: {lpTokenSupply} LPSFC</div>
                <div>Pool Gas Token: {poolGasToken} Dev SOL</div>
                <div>Pool Stable Coin: {poolStableCoin} SFC - VND</div>
                <div>Pool Ratio Dev Sol 1 : {poolRatio} SFC - VND</div>
                <div>Pool K value: {poolKValue}</div>
                <div>
                    <img src="https://i.ibb.co/vxRnDKx/SFC-VND.jpg" alt="SFC - VND Logo" title='SFC - VND Logo' width="100" height="100" />
                    <img src="https://i.ibb.co/wMRXC4M/LP-Token-Logo.webp" alt="LPSFC Logo" title='LPSFC Logo' width="100" height="100" />
                </div>
            </div>}
        </>
    );
}
const App: FC = () => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(() => [], []);
    const onError = useCallback(
        (error: WalletNotConnectedError) => {
            console.error(error);
            alert(error.message);
        },
        []
    );
    return (
        <ConnectionProvider endpoint={endpoint}>
            <div className="wallets-container">
                <WalletProvider wallets={wallets} autoConnect onError={onError}>
                    <WalletModalProvider>
                        <WalletMultiButton />
                        <WalletComponent endpoint={endpoint} />
                    </WalletModalProvider>
                </WalletProvider>
            </div>
        </ConnectionProvider>
    );
}
export default App;