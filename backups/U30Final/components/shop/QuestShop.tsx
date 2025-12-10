import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Zap, Crown, Sparkles, Package } from 'lucide-react';
import { useStore } from '../../store';
import { QUEST_SHOP_ITEMS } from '../../utils/questGenerator';
import { Button } from '../ui/Button';

export const QuestShop: React.FC = () => {
    const { state, purchaseQuestShopItem, purchaseEquipment } = useStore();
    const { questPoints, questShopPurchases = [], shards } = state;
    const [activeTab, setActiveTab] = React.useState<'Supplies' | 'Equipment'>('Supplies');

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
                    <ShoppingBag size={16} />
                    <span>System Shop</span>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-yellow-500">
                        <span>{questPoints}</span>
                        <span className="text-[10px]">QP</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-purple-400">
                        <Sparkles size={12} />
                        <span>{shards}</span>
                        <span className="text-[10px]">SHARDS</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTab('Supplies')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'Supplies' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}
                >
                    Supplies (QP)
                </button>
                <button
                    onClick={() => setActiveTab('Equipment')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'Equipment' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-500'}`}
                >
                    Equipment (Shards)
                </button>
            </div>

            {activeTab === 'Supplies' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {QUEST_SHOP_ITEMS.map((item) => {
                        const isPurchased = item.type === 'cosmetic' && questShopPurchases.includes(item.id);
                        const canAfford = questPoints >= item.cost;
                        const isDisabled = isPurchased || !canAfford;

                        return (
                            <motion.div
                                key={item.id}
                                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                                className={`relative p-4 rounded-xl border transition-all duration-300
                    ${isPurchased
                                        ? 'bg-slate-900/50 border-slate-800 opacity-50'
                                        : 'bg-[#050a14] border-slate-800 hover:border-blue-500/30'
                                    }
                  `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${item.type === 'xp' ? 'bg-blue-900/20 text-blue-400' : 'bg-purple-900/20 text-purple-400'
                                            }`}>
                                            {item.type === 'xp' ? <Zap size={18} /> : <Crown size={18} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-200 text-sm">{item.name}</h4>
                                            <div className="flex items-center gap-1 text-xs font-mono font-bold text-yellow-500">
                                                <span>{item.cost}</span>
                                                <span className="text-[10px]">QP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 mb-4 h-8">
                                    {item.description}
                                </p>

                                <Button
                                    variant={isPurchased ? 'secondary' : 'primary'}
                                    size="sm"
                                    fullWidth
                                    disabled={isDisabled}
                                    onClick={() => purchaseQuestShopItem(item)}
                                    className={!isDisabled ? 'shadow-[0_0_10px_rgba(37,99,235,0.2)]' : ''}
                                >
                                    {isPurchased ? 'Purchased' : canAfford ? 'Buy' : 'Not Enough QP'}
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {[
                        { name: 'Common Chest', cost: 10, rarity: 'common', color: 'text-slate-400', border: 'border-slate-700' },
                        { name: 'Uncommon Chest', cost: 25, rarity: 'uncommon', color: 'text-green-400', border: 'border-green-900' },
                        { name: 'Rare Chest', cost: 50, rarity: 'rare', color: 'text-blue-400', border: 'border-blue-900' },
                        { name: 'Epic Chest', cost: 100, rarity: 'epic', color: 'text-purple-400', border: 'border-purple-900' },
                        { name: 'Legendary Chest', cost: 250, rarity: 'legendary', color: 'text-yellow-400', border: 'border-yellow-900' },
                    ].map((chest) => (
                        <div key={chest.name} className={`bg-[#050a14] border ${chest.border} p-4 rounded-xl flex items-center justify-between`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center ${chest.color}`}>
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h4 className={`font-bold ${chest.color}`}>{chest.name}</h4>
                                    <p className="text-xs text-slate-500">Contains a random {chest.rarity} item.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => purchaseEquipment(chest.cost, chest.rarity as any)}
                                disabled={shards < chest.cost}
                                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all
                                    ${shards >= chest.cost
                                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    }
                                `}
                            >
                                {chest.cost} Shards
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
