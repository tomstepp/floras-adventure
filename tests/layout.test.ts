import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitScale, STAGE_HEIGHT, STAGE_WIDTH } from '../src/layout.ts';

test('PL-6: a mid-size window is limited by its narrower side', () => {
    assert.equal(fitScale(1024, 700), (1024 - 32) / STAGE_WIDTH);
    assert.equal(fitScale(1400, 600), (600 - 32) / STAGE_HEIGHT);
});

test('PL-6: shrinks to fit a phone in portrait and landscape, with a 16px gutter', () => {
    for (const [w, h] of [[390, 844], [844, 390], [375, 667]]) {
        const s = fitScale(w, h);
        assert.ok(STAGE_WIDTH * s <= w - 32 + 1e-9, `${w}x${h}: too wide`);
        assert.ok(STAGE_HEIGHT * s <= h - 32 + 1e-9, `${w}x${h}: too tall`);
        assert.ok(STAGE_WIDTH * s >= w - 32 - 1e-9 || STAGE_HEIGHT * s >= h - 32 - 1e-9, `${w}x${h}: not filling`);
    }
});

test('PL-6: grows on big monitors but caps at 1.5x', () => {
    assert.equal(fitScale(3840, 2160), 1.5);
    assert.ok(fitScale(1600, 1000) > 1);
});
