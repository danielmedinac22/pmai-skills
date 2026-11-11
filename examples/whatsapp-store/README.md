# Example dataset: Casa Nogal, a WhatsApp store

Use this dataset to run the evaluation loop without bringing your own data: decide what "good" means, review real-looking failures, rank them by business impact, build evals, and decide whether to ship.

## The business

**Casa Nogal** is a fictional mid-size home-goods store in Colombia that sells through WhatsApp. It sells cookware, dinnerware, sheets, curtains, small appliances and kitchen storage, and the customer pays in cash when the courier delivers (cash on delivery, or COD). Most customers find it through a social-media ad, tap "message us" and land in a WhatsApp chat. Shipping is free. Two carriers deliver: VíaSur and Cóndor Express (both fictional).

Cash on delivery means the customer has paid nothing when the order ships. If they refuse the package at the door, aren't home, or never pick it up at the carrier office, it comes back and the store pays shipping both ways. That's why this business cares so much about confirming orders and fixing delivery problems.

## The agent

Customers talk to **Lina**, an AI agent. She has five jobs:

| Job (`job` field) | What Lina does |
|---|---|
| `product_question` | Answers questions about products, prices, sizes, colors, stock, shipping times and coverage, using the catalog and policy tools. |
| `place_order` | Collects name, city, address, product, variant and quantity, reads back a summary, and creates the order. |
| `confirm_order` | Sends a confirmation message before the order ships. The customer can confirm, change something or cancel, and Lina applies the change. |
| `delivery_issue` | Handles delivery problems the carrier reports, known in Colombian e-commerce as *novedades*: nobody home, address not found, no cash, waiting at the office, delays. She coordinates a second attempt, fixes the address or reminds the customer to pick up. |
| `post_sale` | Handles tracking questions, complaints, returns and exchanges, mostly by handing off to a person. |
| `other` | Anything else, like other businesses' auto-replies or job seekers. |

When Lina can't solve something (an address change after the order ships, a warranty claim, a refund, an angry customer), she hands off to a human agent with the `handoff_to_human` tool. Two people work the human queue during business hours (Mon–Sat, 8:00–18:00).

**Lina's promise to the business:** every order that ships is one the customer actually wants, at the right address and at the price they agreed. Every customer gets a correct answer within a minute. Anything Lina can't solve reaches a person the same business day. Lina never makes up a product fact, price, stock level or delivery date.

## The numbers that matter

These figures come from real aggregate data for this kind of operation. They were rounded and perturbed, and rows marked *estimate* aren't in the source data.

| Metric | Typical value | Why it matters |
|---|---|---|
| Orders per month | ~3,500 | Scale. |
| Average order value | ~COP 125,000 | |
| Confirmation outcome | 61% confirmed by the customer, 11% by a person, 22% confirmed automatically after 3 h with no reply, 6% cancelled | Orders confirmed by silence are the riskiest to ship. |
| Customers who reply to the confirmation message | ~60% | |
| Dispatched orders delivered / returned | ~55% / ~38% (the rest still open or lost after 30 days) | **The return rate is this business's main cost.** |
| Cost of one returned COD order | ~COP 30,000 for shipping out, shipping back and the COD fee, plus handling and occasional damage *(estimate)* | Each avoidable return is pure loss. |
| Why orders come back (carrier-reported) | Refused at the door 57% (no longer wants it 26%, "not what I ordered" 20%, no cash that day 6%); nobody home or never picked up at the office 31%; address problems 7%; recipient unknown or moved 5% | Most of these can be prevented in the chat. |
| Shipments with at least one delivery issue | ~4 in 10 | |
| Delivery-issue cases that still end delivered | ~30% | This is the "rescue rate" for delivery problems. |
| Delivery-issue messages that get no reply | ~50% | |
| Customers who opt out of messages after a delivery-issue message | ~10% | Opt-outs and blocks hurt the WhatsApp number's quality rating, and that affects every message the store sends. |
| Sales chats handed to a person | ~1 in 6 | Escalation rate. |
| Sales chats that end with no order | ~2 in 3 | |
| Delivered orders where the customer later says "this isn't what I ordered" | ~1 in 3 of those who write after delivery | This is mostly a warehouse problem, but Lina is the one who hears about it. |
| Repeat purchase within 90 days | ~7% *(estimate; not tracked reliably)* | |
| Time to first reply | Lina: under 1 min. People: ~1.5 h in business hours; overnight messages wait until morning. | |

## The traces

`traces.jsonl` holds 66 conversations, one JSON object per line, from October and November 2026 (Bogotá time, UTC-5).

```json
{
  "id": "t001",
  "started_at": "2026-10-03T14:22:00-05:00",
  "channel": "whatsapp",
  "customer": {"segment": "new | returning"},
  "job": "product_question | place_order | confirm_order | delivery_issue | post_sale | other",
  "messages": [{"role": "customer | agent | human_agent | system", "text": "...", "at": "..."}],
  "tool_calls": [{"name": "...", "args": {}, "result": "..."}],
  "outcome": {
    "order_created": true,
    "order_confirmed": true,
    "delivered": true,
    "returned": false,
    "escalated_to_human": false,
    "customer_replied_after_last_agent_msg": false,
    "minutes_to_first_reply": 0.4
  }
}
```

- **Roles:** `agent` is Lina, including the automated messages she sends (confirmation requests, "out for delivery" and delivery-issue notices). `human_agent` is a person from the store's team. `system` is a platform or carrier event the customer never sees, such as `[carrier] Delivery attempt failed`.
- **`tool_calls`** lists what Lina called and what came back, in order. Compare what she *said* with what the tools *returned* and what she *did*. A promise with no matching tool call is a clue.
- **`outcome`:**
  - `null` means unknown or not reached yet. For example, `delivered: null` means the order never shipped or the delivery is disputed.
  - `customer_replied_after_last_agent_msg` is true when the conversation ends with a customer message that got no reply.
  - `minutes_to_first_reply` is the time from the customer's first message to the first reply from Lina or a person, and `null` if no reply ever came. It only measures the *first* reply, so a late reply further into the conversation won't show up here.
- **Placeholders:** street addresses, neighborhoods, phone numbers, photos and links appear as `[street address]`, `[neighborhood]`, `[photo]`, `[tracking link]` and so on. Cities are real; everything else is invented.

## Where this data comes from

The conversations come from real, anonymized WhatsApp conversations of cash-on-delivery stores in Colombia (sales, order confirmation and delivery follow-up), translated into English and rewritten. Every failure in the dataset is a pattern seen in production. The store, people, products, carriers, order and tracking numbers, amounts and times are invented or perturbed, and no message is a verbatim copy.

## How to use it

Start with the skills in this repo and treat `traces.jsonl` as your agent's production log. Do your own review first. When you're done, compare your notes with `.answer-key/`. Don't open it before then.
