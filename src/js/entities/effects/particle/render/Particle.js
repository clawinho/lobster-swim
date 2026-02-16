// Preview renderer for assets page
export function render(ctx, width, height, frame, type = 'bubble', count = 8) {
    ctx.fillStyle = '#000810';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Spawn new particles periodically for preview
    const spawnFrame = frame % 60;

    if (spawnFrame < 1) {
        // Draw fresh burst
        const colors = type === 'bubble' ? ['#88ddff', '#aaeeff', '#ffffff'] :
                       type === 'death' ? ['#ff4500', '#ff6600', '#ff8800'] :
                       ['#ffd700', '#ffec00', '#fff8dc'];
        const gravity = type === 'bubble' ? -0.05 : type === 'death' ? 0.1 : -0.03;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const dist = spawnFrame * 3;
            const size = 4 * (1 - spawnFrame / 60);
            const alpha = 1 - spawnFrame / 60;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = colors[i % colors.length];
            ctx.shadowColor = colors[i % colors.length];
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist + gravity * spawnFrame * spawnFrame, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    } else {
        // Draw expanding particles
        const progress = spawnFrame / 60;
        const colors = type === 'bubble' ? ['#88ddff', '#aaeeff', '#ffffff'] :
                       type === 'death' ? ['#ff4500', '#ff6600', '#ff8800'] :
                       ['#ffd700', '#ffec00', '#fff8dc'];
        const gravity = type === 'bubble' ? -0.05 : type === 'death' ? 0.1 : -0.03;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
            const speed = 2 + (i % 3);
            const dist = progress * speed * 20;
            const gravityOffset = gravity * spawnFrame * spawnFrame * 0.5;
            const size = 4 * (1 - progress);
            const alpha = 1 - progress;

            if (alpha > 0 && size > 0) {
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = colors[i % colors.length];
                ctx.shadowColor = colors[i % colors.length];
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist + gravityOffset, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }

    // Label
    ctx.fillStyle = '#666';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(type.toUpperCase(), cx, height - 10);
}
