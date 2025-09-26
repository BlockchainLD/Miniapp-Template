"use client";

import { ReactNode } from 'react';

// Custom Identity components that mimic OnchainKit's functionality
// but work without OnchainKitProvider

interface CustomIdentityProps {
  address?: string;
  children: ReactNode;
  className?: string;
}

export function CustomIdentity({ address, children, className }: CustomIdentityProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface CustomAvatarProps {
  address?: string;
  className?: string;
  children?: ReactNode;
}

export function CustomAvatar({ className, children }: CustomAvatarProps) {
  return (
    <div className={`relative ${className || ''}`}>
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
        ??
      </div>
      {children}
    </div>
  );
}

interface CustomNameProps {
  address?: string;
  className?: string;
  children?: ReactNode;
}

export function CustomName({ address, className, children }: CustomNameProps) {
  return (
    <div className={className}>
      <span className="font-semibold">
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Unknown User'}
      </span>
      {children}
    </div>
  );
}

interface CustomAddressProps {
  address?: string;
  className?: string;
  isSliced?: boolean;
}

export function CustomAddress({ address, className, isSliced = true }: CustomAddressProps) {
  const displayAddress = isSliced && address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address || 'No address';

  return (
    <span className={className}>
      {displayAddress}
    </span>
  );
}

interface CustomBadgeProps {
  tooltip?: boolean | string;
  className?: string;
}

export function CustomBadge({ tooltip, className }: CustomBadgeProps) {
  return (
    <span 
      className={`inline-flex items-center justify-center w-4 h-4 bg-blue-600 text-white text-xs rounded-full ml-1 ${className || ''}`}
      title={typeof tooltip === 'string' ? tooltip : 'Verified'}
    >
      ✓
    </span>
  );
}
