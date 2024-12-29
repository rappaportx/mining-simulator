"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Timer, Hash, Cpu } from 'lucide-react';

const MiningVisualizer = () => {
  const [miningStats, setMiningStats] = useState({
    currentHash: '',
    nonce: 0,
    extraNonce: 0,
    difficulty: 4,
    blocksMined: 0,
    isRunning: false,
    networkDifficulty: 0,
    hashRate: 0,
    totalHashes: 0,
    startTime: null,
    estimatedTimeLeft: null
  });

  const [blocks, setBlocks] = useState([]);
  const [performance, setPerformance] = useState({
    hashesPerSecond: 0,
    avgTimePerBlock: 0,
    totalRuntime: 0
  });

  const performanceRef = useRef({
    lastUpdate: Date.now(),
    hashCount: 0
  });

  useEffect(() => {
    let intervalId;
    if (miningStats.isRunning) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const elapsed = now - performanceRef.current.lastUpdate;
        const hashRate = performanceRef.current.hashCount / (elapsed / 1000);
        
        setPerformance(prev => ({
          ...prev,
          hashesPerSecond: hashRate.toFixed(2),
          totalRuntime: ((now - miningStats.startTime) / 1000).toFixed(1),
          avgTimePerBlock: miningStats.blocksMined > 0 
            ? ((now - miningStats.startTime) / 1000 / miningStats.blocksMined).toFixed(1)
            : 'N/A'
        }));

        performanceRef.current = {
          lastUpdate: now,
          hashCount: 0
        };
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [miningStats.isRunning, miningStats.blocksMined, miningStats.startTime]);

  useEffect(() => {
    if (!miningStats.isRunning) return;

    const miningInterval = setInterval(() => {
      const newNonce = miningStats.nonce + 1;
      const newHash = generateHash(newNonce, miningStats.extraNonce);
      performanceRef.current.hashCount++;

      if (isValidHash(newHash, miningStats.difficulty)) {
        const newBlock = {
          hash: newHash,
          nonce: newNonce,
          extraNonce: miningStats.extraNonce,
          timestamp: Date.now()
        };
        
        setBlocks(prev => [...prev.slice(-4), newBlock]);
        setMiningStats(prev => ({
          ...prev,
          nonce: 0,
          extraNonce: prev.extraNonce + 1,
          blocksMined: prev.blocksMined + 1,
          currentHash: newHash
        }));
      } else {
        setMiningStats(prev => ({
          ...prev,
          nonce: newNonce,
          currentHash: newHash,
          extraNonce: newNonce >= 4294967295 ? prev.extraNonce + 1 : prev.extraNonce
        }));
      }
    }, 0);

    return () => clearInterval(miningInterval);
  }, [miningStats.isRunning, miningStats.difficulty]);

  const generateHash = (nonce, extraNonce) => {
    const data = `block_${nonce}_${extraNonce}_${Date.now()}`;
    return Array.from(new TextEncoder().encode(data))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const isValidHash = (hash, difficulty) => {
    const target = '0'.repeat(difficulty);
    return hash.startsWith(target);
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Performance
            </h3>
            <div className="mt-2">
              <p>Hash Rate: {performance.hashesPerSecond} H/s</p>
              <p>Blocks Found: {miningStats.blocksMined}</p>
              <p>Runtime: {performance.totalRuntime}s</p>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Current Status
            </h3>
            <div className="mt-2">
              <p>Nonce: {miningStats.nonce.toLocaleString()}</p>
              <p>ExtraNonce: {miningStats.extraNonce}</p>
              <p>Difficulty: {miningStats.difficulty}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className={`px-6 py-2 rounded-lg ${
              miningStats.isRunning ? 'bg-red-500' : 'bg-green-500'
            } text-white font-semibold`}
            onClick={() => {
              if (!miningStats.isRunning) {
                setMiningStats(prev => ({ 
                  ...prev, 
                  isRunning: true,
                  startTime: Date.now()
                }));
              } else {
                setMiningStats(prev => ({ 
                  ...prev, 
                  isRunning: false 
                }));
              }
            }}
          >
            {miningStats.isRunning ? 'Stop Mining' : 'Start Mining'}
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Recent Blocks</h3>
          <div className="space-y-2">
            {blocks.map((block, i) => (
              <div key={i} className="text-sm border-b pb-2">
                <p className="font-mono">Hash: {block.hash.substring(0, 20)}...</p>
                <p>Found at: {new Date(block.timestamp).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningVisualizer;
