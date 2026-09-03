# CampusHub — Product Specification (PROJECT_SPEC.md)

## 1. Executive Summary

**CampusHub** is an all-in-one, magical-academia inspired student companion web application designed to bring delight, utility, and community engagement to collegiate daily life. Combining academic tracking with campus life discovery, social anonymity, and casual recreation, CampusHub transforms mundane university routines into an enchanted, scholarly adventure.

---

## 2. Core Pillars & Value Proposition

1. **Academic Mastery**: Keeping track of attendance, lecture schedules, and thresholds without spreadsheet fatigue.
2. **Campus Discovery**: Uncovering daily canteen menus, crowd levels, and peer recommendations.
3. **Safe Anonymous Expression**: A moderated, privacy-guaranteed campus confession and discussion realm.
4. **Arcane Recreation**: Light-hearted, quick mini-games designed for short breaks between lectures.
5. **Zero-Cost & Free-Tier Accessibility**: Built to be hostable and maintainable on 100% free-tier services without subscription walls.

---

## 3. Product Modules (Planned Roadmap)

### 3.1 Attendance Oracle (Academic Companion)
- **Goal**: Help students track attendance percentage per subject and calculate how many classes they can afford to miss or need to attend to maintain mandatory thresholds (e.g., 75%).
- **Key Capabilities**:
  - Course setup with custom target thresholds.
  - Quick-tap "Attended", "Missed", "Cancelled" logging.
  - Safe bunking margin predictor ("The Oracle's Calculation").
  - Timetable visualizer with today's schedule preview.

### 3.2 Canteen Grimoire (College Food Discovery)
- **Goal**: Enable students to discover food options, daily special menus, pricing, and peak crowd hours across campus canteens and nearby student haunts.
- **Key Capabilities**:
  - Canteen listing with operating hours and location guides.
  - Categorized menu search (quick bites, meals, beverages, budget-friendly).
  - Student ratings & badge tags (e.g., "Best Chai", "Budget Hero", "Quick Service").

### 3.3 The Owl Post (Anonymous Campus Confessions)
- **Goal**: A wholesome and authentic space for students to share thoughts, confessions, campus memes, shout-outs, and relatable student struggles anonymously.
- **Key Capabilities**:
  - Anonymous post submission with tag categorization (Crushes, Academics, Humor, Lost & Found).
  - Upvoting, reactions, and threaded comments.
  - Strong privacy architecture: zero identity leakage from database queries to the client.
  - Community moderation / flag mechanics.

### 3.4 Arcane Breakroom (Mini Games)
- **Goal**: Provide engaging, casual mini-games for students to unwind during study breaks.
- **Key Capabilities**:
  - Scholarly Trivia / Quiz duels.
  - Campus Wordle / Word Alchemy puzzle.
  - Memory & reaction mini-trials.
  - Local high scores and streak tracking.

---

## 4. Non-Functional Requirements

- **Performance**: Sub-second page navigation, lightweight bundle, efficient image optimization.
- **Responsiveness**: Flawless experience on 360px mobile screens up to 4K ultra-wide monitors.
- **Accessibility**: WCAG 2.1 AA compliance, high contrast text ratios on dark and parchment backgrounds, full keyboard navigation.
- **Security & Privacy**: Zero personally identifiable information (PII) linked to public posts. Strict sanitization of user-submitted content.
- **Reliability & Offline-Readiness**: Client-cached views allowing students to view timetables and attendance even with spotty campus Wi-Fi.
