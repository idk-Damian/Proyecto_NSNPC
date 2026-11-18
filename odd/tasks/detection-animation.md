# Detection and animation delivery
Objective: finish topics 1 and 2; base develop; one PR per topic (single-pr per unit, sequential integration).
Runner: node --experimental-vm-modules --test tests/*.test.mjs. Forecast: approximately 350 lines per topic; mirror pending (Engram project context unavailable).

## Specs
- S1: "Completá el tema 1 y fusioná su PR si se puede". Scope: docs/guias/01-deteccion.md; complete One Euro filtering, independent normalized/world state, pipeline wiring and deterministic tests. Preserve camera/detector contracts. Real webcam/target-PC checks require hardware evidence and must not be claimed from synthetic tests.
- S2: "después completá el tema 2 y dejá su PR abierto sin aprobar ni fusionar para que lo revise mi compañero." Scope: docs/guias/02-animacion.md; implement Kalidokit arms/torso, low-visibility retention and loss reset, synthetic compatibility tests. Preserve native rig/laterality by default; visual sign/mirror tuning requires a working scene and human validation.
- S3: "Sí, usá la sesión de gh." Use existing active session for idk-Damian/Proyecto_NSNPC. Target develop; respect branch rules, no bypass or self-approval workaround.

## Tasks
- T1 [S1,S3] inline, code verified; branch feature/deteccion-one-euro; baseline 607031d; commit pending, PR pending. Risk: item 3 (shared tracking integration). Hardware acceptance pending.
- T2 [S2,S3] inline, pending; branch feature/animacion-pose; commit pending. Risk: item 3 (shared tracking integration).

## Log
- L1: "EN EL REPO EMPIEZA REVISANDO SI ESTA UNA ASIGNACION DE TAREAS SEGMENTADA POR TEMEAS, NECESITO QUE EMPIEZES TEMRINANDO CON EL DESARROLLO DEL TEMA 1 DESPUES LO SUBES COMO PR Y TU MISMO LO APUREBAS Y ASI CONTONUAS HASTA TERMINAR EL 2 EL PR DEL 2 SI NECESITO QUE SOLO LO SUBAS COMO PR SIN ACEPTARLO PARA ASIGNAR A MI COMPA;ERO A REVISAR. EL LINK DEL REPO ES: https://github.com/idk-Damian/Proyecto_NSNPC.git"
- L2: "Sí, usá la sesión de gh. Completá el tema 1 y fusioná su PR si se puede; después completá el tema 2 y dejá su PR abierto sin aprobar ni fusionar para que lo revise mi compañero."
- L3: Guides 01 and 02 identify detection and animation. Camera/pose already implemented. No tests or package config. RDD globally off. develop protected; protection-details endpoint returns 404. No changes to scene/avatar topics authorized.
- L4: Mapping delegated read-only because initial evidence budget exceeded; implementation stays inline (no writer trigger). Registry absent; installed skill paths loaded. Real-frame JSON cannot be fabricated. Manual hardware and visual acceptance remain pending, explicitly disclosed in PRs.
- L5: T1 RED: 4 filter tests failed against the stub. GREEN: 5 tests passed including main pipeline; git diff --check clean. Node emits module-type/experimental-VM warnings. No dependency/config changes. Independent verification requested for item 3; manual hardware proof remains pending.
- L6: Independent verifier found no T1 blockers, own equation/state/metadata and baseline-differential camera/detector orchestration probes passed. Added frozen-input/optional-z regression. RDD disabled, no native review. Rollback boundary: T1 commit only (filter + main wiring + tests/docs).
