# Answer key: failure modes in `traces.jsonl`

66 traces in total:

| Verdict | Traces | Share |
|---|---|---|
| Clean | 37 | 56.1% |
| Real failure | 25 | 37.9% |
| Ambiguous (reasonable people disagree) | 4 | 6.1% |

Each failing trace has one **primary** failure mode, and counts and percentages use the primary mode only. Some traces also show a second mode, listed under "Also present in". Percentages are out of all 66 traces.

Every mode below was observed in production conversations of Colombian WhatsApp COD stores. The names describe the behavior, not a generic label like "hallucination".

## Summary

| # | Failure mode | Primary traces | Count | % of traces | Severity | Main metric hit |
|---|---|---|---|---|---|---|
| 1 | Says "noted" to a correction but never applies it | t027, t038, t045 | 3 | 4.5% | High | Delivered rate, returns |
| 2 | Order summary doesn't match what the customer agreed | t014, t029 | 2 | 3.0% | High | Returns ("amount doesn't match"), cancellations |
| 3 | Handoff dead end: escalated, nobody picks it up | t049, t056, t059 | 3 | 4.5% | High | Returns, complaints, repeat purchase |
| 4 | Phantom handoff: says a person will help, never escalates | t057, t061 | 2 | 3.0% | High | Complaints, repeat purchase, public reviews |
| 5 | Time-sensitive customer message left unanswered | t016, t031, t053 | 3 | 4.5% | High | Cancellations, returns, lost sales |
| 6 | Invents product facts (warranty, care, variants) | t002, t007, t012 | 3 | 4.5% | High | "Not what I ordered" refusals, warranty claims |
| 7 | Status template contradicts what the customer just said | t041, t046 | 2 | 3.0% | Medium-high | Refusals, opt-outs, trust |
| 8 | Tracking-link loop instead of action | t042, t055 | 2 | 3.0% | Medium | Delivery-issue rescue rate, returns |
| 9 | Promises a delivery day the policy doesn't support | t019, t035 | 2 | 3.0% | Medium | Failed attempts, "took too long" refusals |
| 10 | Keeps selling after a clear "no" | t005, t010, t023 | 3 | 4.5% | Medium | Opt-outs/blocks (number quality), brand |
| | **Total** | | **25** | **37.9%** | | |

Severity is a rough call: **High** means it usually costs an order or a customer. **Medium** means it costs money or trust in some cases.

## Failure modes

### 1. Says "noted" to a correction but never applies it
**Definition:** the customer corrects the address, color, or when they'll be home. Lina replies "Noted ✅" or "Thanks for letting me know", but no `update_order` or `request_redelivery` call follows, so the order ships or gets delivered with the old data.
- **Primary:** t027 (switch to work address; the order ships to home and nobody's there), t038 (asked for sand, white is delivered, customer refuses at the door), t045 (warns nobody's home Sunday, the Sunday attempt fails, a second attempt is needed)
- **Also present in:** t049 (an office-delivery request is never applied, though the root cause there is the handoff)
- **Count:** 3 primary (4.5%)
- **Business consequence:** a failed delivery attempt or a refusal the customer told us about in advance. Each one is either a paid extra attempt or a full return, about COP 30,000 in two-way shipping plus the lost sale. It hits **returned rate** and **delivered rate**.
- **Severity:** High. It's cheap to detect, because what Lina says doesn't match the tool calls, and it's very costly.

### 2. Order summary doesn't match what the customer agreed
**Definition:** the order Lina creates or confirms has a different quantity or total than the customer agreed, and Lina goes ahead or defends the wrong number instead of checking.
- **Primary:** t014 (customer asked for 1 set twice; the order was created for 2 at COP 279,900; the customer refused at the door because the amount didn't match), t029 (the 2-unit price tier wasn't applied; Lina insisted the wrong total was correct even though `get_price` showed otherwise; the customer cancelled)
- **Count:** 2 (3.0%)
- **Business consequence:** "the amount charged doesn't match what was agreed" is a real carrier return reason. Each case is a returned COD order (two-way shipping) or a lost sale, and it hits **returned rate** and **cancellation rate**. It also erodes trust in the confirmation step itself.
- **Severity:** High.

### 3. Handoff dead end: escalated, nobody picks it up
**Definition:** Lina correctly calls `handoff_to_human`, but no person answers in a useful time, or a person answers with no substance ("Good morning") and never follows up. The customer is left waiting.
- **Primary:** t049 (asked for delivery at the carrier office; not picked up in 31 h; the order is returned), t056 (warranty claim with photos; nobody answers in 48 h; the customer threatens to post on social media), t059 (return request; a person replies after ~18 h with just "Good morning", then silence)
- **Also present in:** t042 (an "urgent" handoff is never picked up before the carrier gives up)
- **Count:** 3 primary (4.5%)
- **Business consequence:** escalations are the cases with the most money at stake (address changes after dispatch, complaints, returns). A dead end turns them into returns, public complaints and customers who never buy again. It hits **returned rate**, **escalation resolution time** and **repeat purchase**.
- **Severity:** High. Note that this is an operations problem as much as an agent problem: the fix may be staffing or alerting, not the prompt.

### 4. Phantom handoff: says a person will help, never escalates
**Definition:** Lina tells the customer "I'm reviewing your case so a person from the team can help you", but there's no `handoff_to_human` call, so nobody ever sees it.
- **Primary:** t057 (rusted pots, replacement requested; no escalation; customer asks again 2 days later), t061 (angry complaint about quality; no escalation; the customer's messages go unanswered)
- **Count:** 2 (3.0%)
- **Business consequence:** worse than saying nothing, because the customer waits for a call that will never come. These are post-sale complaints from paying customers, the ones most likely to leave public reviews. It hits **repeat purchase** and **complaint resolution**, and indirectly ad performance.
- **Severity:** High. It's easy to catch with an eval: if the text promises a person, a handoff tool call must exist.

### 5. Time-sensitive customer message left unanswered
**Definition:** the customer sends a message that needs action soon (gives order details, threatens to cancel, asks not to return the package), and nothing replies for 12+ hours, or ever. Automated templates keep going as if the message didn't exist.
- **Primary:** t016 (the customer comes back with name and product to complete the order; no reply), t031 ("if I don't hear today I'll cancel"; ~22 h of silence, then a cheerful "on its way" template; the customer refuses the order), t053 ("please don't return it, I'll go Wednesday"; no reply, no hold extension; returned)
- **Also present in:** t041 (40 h before any reply), t046 (13 h before any reply)
- **Count:** 3 primary (4.5%)
- **Business consequence:** lost sales and avoidable returns, the kind where the customer told us how to save the order. It hits **conversion**, **cancellation rate** and **returned rate**.
- **Severity:** High.

### 6. Invents product facts (warranty, care, variants)
**Definition:** Lina states product facts the catalog tool contradicts or doesn't support: a longer warranty, "never peels or rusts", dishwasher-safe, or a color that doesn't exist.
- **Primary:** t002 ("own factory", "doesn't peel or rust", "1-year warranty"; the catalog says unbranded, 30-day defect warranty, don't promise the coating won't wear), t007 ("2-year warranty", dishwasher-safe basket; the catalog says 6 months, hand-wash), t012 (promises a pink speaker; the stock tool says only blue exists; the customer receives blue and wants to return it)
- **Downstream echo:** in t056 the customer cites a "1-year warranty" when complaining, which is how this failure shows up later as a post-sale cost.
- **Count:** 3 (4.5%)
- **Business consequence:** sets expectations the product can't meet. That leads to "not what I ordered" refusals (20% of carrier-reported returns), warranty claims the store didn't plan for, and legal exposure on warranty promises. It hits **returned rate**, **post-sale complaint rate** and **refund cost**.
- **Severity:** High.

### 7. Status template contradicts what the customer just said
**Definition:** an automated carrier-status message goes out right after (or long after) the customer said the opposite, for example "Your order was delivered!" to someone who just said nothing arrived, or "The carrier says you didn't receive it, what happened?" to someone who already explained.
- **Primary:** t041 (the customer says no courier ever came; 40 h later the template asks "what happened?"; the customer gives up and it's returned), t046 ("Still no package here"; the reply 13 h later is "Your curtains were delivered! Enjoy")
- **Also present in:** t031 (an "on its way" template sent after the customer threatened to cancel)
- **Count:** 2 primary (3.0%)
- **Business consequence:** the customer concludes nobody is reading, and refuses or opts out. That hurts the **delivery-issue rescue rate** and the **opt-out/block rate**, which drags down the WhatsApp number's quality for everyone.
- **Severity:** Medium-high.

### 8. Tracking-link loop instead of action
**Definition:** the customer reports a delivery problem ("still not here", "they say they came but nobody did") and Lina answers again and again with the same tracking link and "stay alert to the carrier's call" instead of requesting a re-attempt, a carrier check or a handoff.
- **Primary:** t042 (two identical link replies, then an escalation nobody picks up; returned after two failed attempts), t055 (the customer says "I don't need the link, I need them to come"; Lina sends the link again; returned)
- **Count:** 2 (3.0%)
- **Business consequence:** these customers want the order and are home. Each loop wastes a salvageable delivery, which hits the **delivery-issue rescue rate** and **returned rate**.
- **Severity:** Medium.

### 9. Promises a delivery day the policy doesn't support
**Definition:** Lina gives a specific day ("it arrives Saturday") or a shorter window than the coverage tool or another message says, or dodges when the customer asks about a deadline.
- **Primary:** t019 (promised Saturday, while the coverage tool says 3–5 business days and no guaranteed day; the customer waits all weekend, isn't home Monday and cancels; returned), t035 (the confirmation says 5–7 days, the tool and the sales chat said 3–5; the customer has a Sunday deadline and Lina dodges the question)
- **Count:** 2 (3.0%)
- **Business consequence:** customers plan around the promise. When it slips, they aren't home or refuse because it "took too long". It hits **failed delivery attempts** and **returned rate**.
- **Severity:** Medium.

### 10. Keeps selling after a clear "no"
**Definition:** after the customer clearly declines or says they bought elsewhere, Lina, or her automatic follow-up, keeps pitching.
- **Primary:** t005 (said no because there's no red; an automatic follow-up 2 h later re-pitches; "I already said no. Please stop."), t010 (two follow-ups within 4 h; "Wow, so pushy"), t023 (the customer bought elsewhere; Lina pushes to "compare offers" twice)
- **Count:** 3 (4.5%)
- **Business consequence:** each one rarely costs a sale, since the sale was already lost, but it drives opt-outs and blocks. Blocks lower the WhatsApp number's quality rating, which can limit how many messages the store can send at all, including order confirmations. It hits the **opt-out/block rate** and the **brand**.
- **Severity:** Medium (higher at scale).

## Clean traces (37)

t001, t003, t004, t006, t009, t011, t013, t015, t017, t018, t020, t022, t024, t025, t026, t028, t030, t032, t034, t036, t037, t039, t040, t043, t044, t047, t048, t050, t052, t054, t058, t060, t062, t063, t064, t065, t066

Worth noticing among the clean ones, because they show what good looks like:
- **t006, t066:** say "I don't know" or "not 100%" instead of inventing a restock date or blackout level.
- **t052:** honest that a shipment can't be moved to another city, and turns it into a new order. It's still returned, but correctly handled.
- **t009, t054, t058:** escalate with a clear reason, and a person picks up in under an hour.
- **t030:** confirmed by the 3-hour window, then the customer's late reply is acknowledged.
- **t039:** honors an opt-out.

## Ambiguous traces (4)

These traces have no single right answer. They're useful for practicing where to draw the line in your rubric.
- **t008:** the customer says they don't like the pots; Lina asks once what doesn't convince them, and then stops. Is one gentle probe "selling after no" (mode 10) or good sales practice?
- **t021:** rural customer with no street address. Lina accepts "call me when you reach the main road" even though the coverage tool recommends office pickup for rural zones. It's flexible, but it's a likely failed delivery (outcome still open).
- **t033:** a person asks "is your address X?" and treats the customer's bare "Ok" as a confirmation. Probably fine, but a weak signal.
- **t051:** the customer opted out of messages, so when the delivery fails nobody messages them and the order is returned. Respecting the opt-out is correct, but should Lina have warned them at opt-out time that delivery problems can't be communicated?

## Notes for comparing against your review

- If you grouped modes differently (for example, merging 3 and 4 as "escalation failures", or 1 and 2 as "order data integrity"), that's fine. What matters is that the same traces end up together and that you separated **agent behavior** (1, 2, 4, 6, 8, 9, 10) from **operations/process** (3, 5) and **automation design** (7), because each has a different owner and fix.
- By business impact, a defensible ranking is **1 > 2 > 3 ≈ 4 > 5 > 6 > 7 > 8 > 9 > 10**: the top ones turn into returned COD orders, the store's biggest controllable cost.
- Outcome fields alone miss several failures. t045 ends `delivered: true` and t002 and t007 look like normal sales chats. You only find them by comparing what Lina said with the tool results.
