/**
 * Lobster.v006.js - Adds walking legs to baby and adult lobster
 * @version 006
 * @current true
 *
 * Baby lobster: 3 pairs of tiny stubby legs, subtle wiggle
 * Adult lobster: 4 pairs of jointed walking legs, animated walk cycle
 * Everything else inherited from v005 design.
 */
export function render(ctx, x, y, size, angle, tailSegments, invincible, invincibleTimer, stage = 2) {
    if (invincible && Math.floor(invincibleTimer / 5) % 2 === 0) {
        ctx.globalAlpha = 0.4;
    }

    const isBaby = stage <= 2;
    const tailAngle = Math.sin(Date.now() / 300) * 0.3;

    // Tail segments
    ctx.fillStyle = isBaby ? '#ff6644' : '#cc3300';
    for (let i = 0; i < 2; i++) {
        const segScale = isBaby ? (0.35 - i * 0.08) : (0.5 - i * 0.12);
        const segSize = size * segScale;
        ctx.save();
        ctx.translate(tailSegments[i].x, tailSegments[i].y);
        ctx.rotate(tailSegments[i].angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, segSize, segSize * (isBaby ? 0.8 : 0.7), tailAngle * (i + 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Tail fan — adults only
    if (!isBaby) {
        ctx.fillStyle = '#ff4500';
        ctx.save();
        ctx.translate(tailSegments[2].x, tailSegments[2].y);
        ctx.rotate(tailSegments[2].angle);
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.ellipse(-8, i * 4, 8, 3, tailAngle * 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    } else {
        // Baby: small rounded tail nub
        ctx.fillStyle = '#ff8866';
        ctx.save();
        ctx.translate(tailSegments[2].x, tailSegments[2].y);
        ctx.rotate(tailSegments[2].angle);
        ctx.beginPath();
        ctx.ellipse(-4, 0, 5, 4, tailAngle, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Body
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // === LEGS (drawn BEFORE body so they appear underneath) ===
    const legTime = Date.now() / 180;
    ctx.strokeStyle = isBaby ? '#ee5533' : '#cc3300';
    ctx.lineWidth = isBaby ? 1.5 : 2;

    if (isBaby) {
        // Baby: 3 pairs of tiny stubby legs
        const legPairs = 3;
        for (let i = 0; i < legPairs; i++) {
            const xOff = size * (0.1 - i * 0.2); // spread along body
            const wave = Math.sin(legTime + i * 1.2) * 0.2;
            const legLen = size * 0.35;
            // Top leg
            ctx.beginPath();
            ctx.moveTo(xOff, -size * 0.45);
            ctx.quadraticCurveTo(xOff - 2, -size * 0.45 - legLen * 0.6 + wave * 3, xOff - 4, -size * 0.45 - legLen + wave * 5);
            ctx.stroke();
            // Bottom leg
            ctx.beginPath();
            ctx.moveTo(xOff, size * 0.45);
            ctx.quadraticCurveTo(xOff - 2, size * 0.45 + legLen * 0.6 - wave * 3, xOff - 4, size * 0.45 + legLen - wave * 5);
            ctx.stroke();
        }
    } else {
        // Adult: 4 pairs of jointed walking legs
        const legPairs = 4;
        for (let i = 0; i < legPairs; i++) {
            const xOff = size * (0.25 - i * 0.22); // spread along body
            const wave = Math.sin(legTime + i * 1.0) * 0.3;
            const upperLen = size * 0.35;
            const lowerLen = size * 0.3;

            // Top leg (upper side)
            const topJointX = xOff - upperLen * 0.3;
            const topJointY = -size * 0.4 - upperLen * 0.5;
            const topEndX = topJointX - lowerLen * 0.2;
            const topEndY = topJointY - lowerLen * 0.4 + wave * 6;
            ctx.beginPath();
            ctx.moveTo(xOff, -size * 0.38);
            ctx.lineTo(topJointX, topJointY);
            ctx.lineTo(topEndX, topEndY);
            ctx.stroke();

            // Bottom leg (lower side)
            const botJointX = xOff - upperLen * 0.3;
            const botJointY = size * 0.4 + upperLen * 0.5;
            const botEndX = botJointX - lowerLen * 0.2;
            const botEndY = botJointY + lowerLen * 0.4 - wave * 6;
            ctx.beginPath();
            ctx.moveTo(xOff, size * 0.38);
            ctx.lineTo(botJointX, botJointY);
            ctx.lineTo(botEndX, botEndY);
            ctx.stroke();
        }
    }

    ctx.lineWidth = 1;

    // Body ellipse (on top of legs)
    ctx.fillStyle = isBaby ? '#ff6644' : '#ff4500';
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * (isBaby ? 0.8 : 0.6), 0, 0, Math.PI * 2);
    ctx.fill();

    const clawWave = Math.sin(Date.now() / 200) * 0.15;

    if (isBaby) {
        // Baby: tiny stubby claws
        const stubSize = size * 0.25;
        ctx.fillStyle = '#ff8866';
        ctx.save();
        ctx.rotate(-0.4 + clawWave);
        ctx.beginPath();
        ctx.ellipse(size * 0.7, -size * 0.05, stubSize, stubSize * 0.6, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.rotate(0.4 - clawWave);
        ctx.beginPath();
        ctx.ellipse(size * 0.7, size * 0.05, stubSize, stubSize * 0.6, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else {
        // Adult: full claws
        ctx.save();
        ctx.rotate(-0.5 + clawWave);
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.ellipse(size * 0.9, -size * 0.1, size * 0.5, size * 0.25, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cc3300';
        ctx.beginPath();
        ctx.moveTo(size * 1.3, -size * 0.2);
        ctx.lineTo(size * 1.6, -size * 0.4);
        ctx.lineTo(size * 1.6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.rotate(0.5 - clawWave);
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.ellipse(size * 0.9, size * 0.1, size * 0.5, size * 0.25, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cc3300';
        ctx.beginPath();
        ctx.moveTo(size * 1.3, size * 0.2);
        ctx.lineTo(size * 1.6, size * 0.4);
        ctx.lineTo(size * 1.6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Eyes
    const eyeR = isBaby ? 5 : 4;
    const eyeY = isBaby ? 0.25 : 0.2;
    const eyeX = isBaby ? 0.35 : 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(size * eyeX, -size * eyeY, eyeR, 0, Math.PI * 2);
    ctx.arc(size * eyeX, size * eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size * (eyeX + 0.02), -size * (eyeY + 0.02), eyeR * 0.4, 0, Math.PI * 2);
    ctx.arc(size * (eyeX + 0.02), size * (eyeY - 0.02), eyeR * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Antennae
    ctx.strokeStyle = isBaby ? '#ff8866' : '#ff6600';
    ctx.lineWidth = isBaby ? 1.5 : 2;
    const antWave = Math.sin(Date.now() / 150) * (isBaby ? 3 : 5);
    if (isBaby) {
        ctx.beginPath();
        ctx.moveTo(size * 0.5, -size * 0.3);
        ctx.quadraticCurveTo(size * 0.6, -size * 0.5 + antWave, size * 0.7, -size * 0.4 + antWave);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size * 0.5, size * 0.3);
        ctx.quadraticCurveTo(size * 0.6, size * 0.5 - antWave, size * 0.7, size * 0.4 - antWave);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(size * 0.5, -size * 0.3);
        ctx.quadraticCurveTo(size * 0.8, -size * 0.8 + antWave, size * 1.2, -size * 0.6 + antWave);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size * 0.5, size * 0.3);
        ctx.quadraticCurveTo(size * 0.8, size * 0.8 - antWave, size * 1.2, size * 0.6 - antWave);
        ctx.stroke();
    }
    ctx.lineWidth = 1;

    ctx.restore();
    ctx.globalAlpha = 1;

    // Invincibility shield
    if (invincible) {
        ctx.strokeStyle = '#ffff0066';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, size + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 1;
    }
}

export const meta = {
    version: "006",
    name: "Lobster with Legs",
    current: true,
    features: ["walking legs", "stage-aware rendering", "baby lobster (L1)", "adult lobster (L2+)", "jointed leg animation", "real tail physics", "animated claws", "invincibility shield"]
};
