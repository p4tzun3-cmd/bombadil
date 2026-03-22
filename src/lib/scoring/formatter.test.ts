import { describe, it, expect } from 'vitest';
import { formatScore } from './formatter';

describe('formatScore', () => {
	it('formats decimal', () => {
		expect(formatScore(128, 'decimal')).toBe('128');
		expect(formatScore(0, 'decimal')).toBe('0');
		expect(formatScore(-50, 'decimal')).toBe('-50');
	});

	it('formats binary', () => {
		expect(formatScore(128, 'binary')).toBe('10000000');
		expect(formatScore(256, 'binary')).toBe('100000000');
		expect(formatScore(0, 'binary')).toBe('0');
	});

	it('formats octal', () => {
		expect(formatScore(128, 'octal')).toBe('200');
		expect(formatScore(64, 'octal')).toBe('100');
		expect(formatScore(0, 'octal')).toBe('0');
	});

	it('formats hex', () => {
		expect(formatScore(255, 'hex')).toBe('0xFF');
		expect(formatScore(128, 'hex')).toBe('0x80');
		expect(formatScore(0, 'hex')).toBe('0x0');
	});

	it('handles negative values with minus prefix', () => {
		expect(formatScore(-128, 'binary')).toBe('-10000000');
		expect(formatScore(-128, 'octal')).toBe('-200');
		expect(formatScore(-255, 'hex')).toBe('-0xFF');
		expect(formatScore(-50, 'decimal')).toBe('-50');
	});

	it('defaults to decimal for unknown format', () => {
		expect(formatScore(128, 'unknown' as any)).toBe('128');
	});
});
