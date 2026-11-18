# Animation delivery
Objective: topic 2 only, branch feature/animacion-pose, base develop, single-pr; forecast approximately 300 lines.
Runner: node --experimental-vm-modules --test tests/*.test.mjs. Engram mirror pending (project binding unavailable).

## Specs
- S1: "Completá el tema 1 y fusioná su PR si se puede". Detection implemented separately in PR #4; merge attempted and blocked by required review. Do not bypass protection.
- S2: "después completá el tema 2 y dejá su PR abierto sin aprobar ni fusionar para que lo revise mi compañero." Implement docs/guias/02-animacion.md: Kalidokit arms/torso, low-visibility retention and loss reset. Use native mirrored Kalidokit 1.1.5 rig convention, documented from pinned source. Real webcam/visual tests are pending; scene/avatar topics out of scope.
- S3: "Sí, usá la sesión de gh." Use active session for idk-Damian/Proyecto_NSNPC; publish only topic 2, target develop, no approval/merge.

## Tasks
- T2 [S2,S3] inline, code verified, baseline 607031d, commit/PR pending. Risk: item 3 (shared tracking integration). Hardware/visual acceptance pending.

## Log
- L1: "EN EL REPO EMPIEZA REVISANDO SI ESTA UNA ASIGNACION DE TAREAS SEGMENTADA POR TEMEAS, NECESITO QUE EMPIEZES TEMRINANDO CON EL DESARROLLO DEL TEMA 1 DESPUES LO SUBES COMO PR Y TU MISMO LO APUREBAS Y ASI CONTONUAS HASTA TERMINAR EL 2 EL PR DEL 2 SI NECESITO QUE SOLO LO SUBAS COMO PR SIN ACEPTARLO PARA ASIGNAR A MI COMPA;ERO A REVISAR. EL LINK DEL REPO ES: https://github.com/idk-Damian/Proyecto_NSNPC.git"
- L2: "Sí, usá la sesión de gh. Completá el tema 1 y fusioná su PR si se puede; después completá el tema 2 y dejá su PR abierto sin aprobar ni fusionar para que lo revise mi compañero."
- L3: Detection PR #4, commit 6db7c09 (219 changed lines), 6 tests pass, independent verification found no blockers. Merge rejected by branch protection (REVIEW_REQUIRED); PR stays open. Hardware/real-frame validation pending. RDD globally off.
- L4: Separate branch from develop keeps topic 2 independent and avoids a polluted PR. Topic 1 log remains on its branch; this delivery has a separate feature identity. Shared test harness is byte-identical to topic 1. Source Kalidokit 1.1.5 verified: MediaPipe 11/13/15 maps to Right arm, 12/14/16 to Left; preserve mirrored convention, not arbitrary VRM-specific signs.
- L5: RED observed: valid-frame and arm-retention tests fail against solver stub. GREEN: 4/4 tests passed including downloaded real pinned Kalidokit 1.1.5 with synthetic MediaPipe-shaped input. No fabricated camera frames; no dependency changes. Added pipeline-loss regression; independent verifier requested for item 3.
- L6: 5/5 tests pass (no skipped tests when pinned module path provided); diff check clean. Independent verifier: no blockers, own real-library and baseline-differential tracking/video/fullscreen/reacquisition probes passed. RDD disabled; no review ceremony. Rollback boundary: topic 2 commit (solver, main loss notification, tests/docs), independent of detection PR4.
