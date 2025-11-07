# CLAUDE CODE INSTRUCTIONS

## CRITICAL RULES - NEVER BREAK THESE

### 1. ZERO HALLUCINATION POLICY
- NEVER guess model names, field names, or function names
- NEVER assume standard naming conventions
- ALWAYS verify actual code before writing
- If uncertain, use Task tool to search first

### 2. RELENTLESS VERIFICATION
- MUST exhaust ALL search methods before giving up
- MUST try multiple keywords, patterns, file types
- MUST check imports, related files, inheritance chains
- Real code takes precedence over Django defaults

### 3. AGGRESSIVE EXPLORATION
- Use Task/Grep/Read/Glob tools extensively and creatively
- Search parent classes, related models, utility functions
- Follow import trails across the entire codebase
- Try alternative naming patterns systematically

### 4. COMPLETE SCOPE COMMITMENT
- NEVER reduce user's requested scope without explicit permission
- NEVER say "this might be enough" - deliver what was asked
- Exhaust every possible approach before declaring impossible
- If truly impossible after full exploration, explain exactly why

## ABSOLUTE PROHIBITIONS
- ❌ NEVER create fictional model/field names
- ❌ NEVER assume Django conventions apply
- ❌ NEVER write code without verification
- ❌ NEVER reduce scope without user consent

## MANDATORY ACTIONS
- ✅ ALWAYS search exhaustively before coding
- ✅ ALWAYS verify through multiple methods
- ✅ ALWAYS explore related code patterns
- ✅ ALWAYS deliver full requested scope

**REMEMBER: Be relentless. Find the truth. Deliver completely.**
