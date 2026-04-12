
export interface TemplateResult {
  subject: string
  html: string
  text: string
}

const site = {
  name: 'Kenai Home Sales',
  domain: 'kenaihomesales.com',
  accent: '#0891b2',
  accentSoft: '#cffafe',
  supportEmail: 'hello@kenaihomesales.com',
  icon: '🏠',
}

const networkLinks = [
  { label: 'Kenai Borough', href: 'https://kenaiborough.com' },
  { label: 'Kenai Borough Realty', href: 'https://kenaiboroughrealty.com' },
  { label: 'Kenai Land Sales', href: 'https://kenailandsales.com' },
  { label: 'Kenai Peninsula Rentals', href: 'https://kenaipeninsularentals.com' },
  { label: 'Kenai Home Sales', href: 'https://kenaihomesales.com' },
  { label: 'Kenai Auto Sales', href: 'https://kenaiautosales.com' },
  { label: 'Kenai Listings', href: 'https://kenailistings.com' }
]

interface LayoutOptions {
  title: string
  eyebrow: string
  preview: string
  body: string
  ctaLabel?: string
  ctaUrl?: string
  footerNote?: string
  unsubscribeUrl?: string
}

function renderLayout(options: LayoutOptions): TemplateResult {
  const cta = options.ctaLabel && options.ctaUrl
    ? `<tr><td style="padding:0 40px 32px;"><a href="${options.ctaUrl}" style="display:inline-block;background:${site.accent};color:#ffffff;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;">${options.ctaLabel}</a></td></tr>`
    : ''
  const footerLinks = networkLinks
    .map((link) => `<a href="${link.href}" style="color:${site.accent};text-decoration:none;margin-right:10px;">${link.label}</a>`)
    .join('')
  const unsubscribeUrl = options.unsubscribeUrl ?? '{unsubscribe_url}'
  const html = `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3f4f6;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none !important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${options.preview}</span>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 20px 45px rgba(15,23,42,0.12);">
            <tr>
              <td style="padding:0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${site.accent};">
                  <tr>
                    <td style="padding:28px 32px;color:#ffffff;">
                      <div style="font-size:14px;letter-spacing:0.24em;text-transform:uppercase;opacity:0.9;">Kenai Peninsula Network</div>
                      <div style="margin-top:16px;display:flex;align-items:center;gap:12px;font-size:28px;font-weight:700;">${site.icon} ${site.name}</div>
                      <div style="margin-top:18px;border-top:1px solid rgba(255,255,255,0.18);padding-top:18px;">
                        <svg width="100%" height="56" viewBox="0 0 560 56" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kenai mountains and aurora">
                          <path d="M0 46 60 24 118 40 176 14 238 44 304 18 360 40 422 8 486 36 560 20" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M28 8C104 34 198 -8 292 14c88 20 170 8 240-8" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="6" stroke-linecap="round"/>
                        </svg>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px 20px;">
                <div style="display:inline-block;background:${site.accentSoft};color:${site.accent};padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">${options.eyebrow}</div>
                <h1 style="margin:20px 0 12px;font-size:30px;line-height:1.2;">${options.title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 24px;font-size:16px;line-height:1.8;color:#334155;">${options.body}</td>
            </tr>
            ${cta}
            <tr>
              <td style="padding:0 40px 36px;font-size:13px;line-height:1.7;color:#64748b;">${options.footerNote ?? `Need help? Reply to this email or reach us at <a href="mailto:${site.supportEmail}" style="color:${site.accent};text-decoration:none;">${site.supportEmail}</a>.`}</td>
            </tr>
            <tr>
              <td style="padding:22px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.8;color:#64748b;">
                <div style="font-weight:700;color:#0f172a;">Part of the Kenai Peninsula Network</div>
                <div style="margin-top:10px;">${footerLinks}</div>
                <div style="margin-top:10px;">Manage notification preferences or <a href="${unsubscribeUrl}" style="color:${site.accent};text-decoration:none;">unsubscribe</a>.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
  const text = `${options.title}

${options.preview}

${options.body.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()}

${options.ctaLabel && options.ctaUrl ? `${options.ctaLabel}: ${options.ctaUrl}

` : ''}Part of the Kenai Peninsula Network — ${networkLinks.map((link) => link.href).join(', ')}
Unsubscribe: ${unsubscribeUrl}`
  return { subject: options.title, html, text }
}

export const emailTemplates = {
  welcomeEmail(params: { recipientName: string; dashboardUrl?: string }) {
    return renderLayout({
      eyebrow: 'Welcome',
      title: `Welcome to ${site.name}`,
      preview: `Your new account is ready for listings, alerts, and local connections on ${site.name}.`,
      body: `<p style="margin:0 0 16px;">Hi ${params.recipientName},</p><p style="margin:0 0 16px;">Thanks for joining ${site.name}. Your Kenai Network account is ready to send inquiries, manage listings, and receive local notifications across the peninsula.</p><p style="margin:0;">Complete your profile, set your email preferences, and start connecting with buyers, sellers, guests, or local businesses.</p>`,
      ctaLabel: 'Open my dashboard',
      ctaUrl: params.dashboardUrl,
    })
  },
  passwordResetEmail(params: { recipientName: string; resetUrl: string }) {
    return renderLayout({
      eyebrow: 'Security',
      title: 'Reset your password',
      preview: 'Use the secure link below to reset your Kenai Network password.',
      body: `<p style="margin:0 0 16px;">Hi ${params.recipientName},</p><p style="margin:0 0 16px;">We received a request to reset your password for ${site.name}.</p><p style="margin:0;">For your security, this link should only be used by you and will expire automatically.</p>`,
      ctaLabel: 'Reset password',
      ctaUrl: params.resetUrl,
    })
  },
  accountVerificationEmail(params: { recipientName: string; verifyUrl: string }) {
    return renderLayout({
      eyebrow: 'Verify account',
      title: 'Confirm your email address',
      preview: 'Verify your address to activate email notifications and account recovery.',
      body: `<p style="margin:0 0 16px;">Hi ${params.recipientName},</p><p style="margin:0 0 16px;">Please confirm your email address for ${site.name} so we can deliver inquiries, alerts, and security notifications.</p><p style="margin:0;">Once verified, your account will be fully ready for marketplace activity.</p>`,
      ctaLabel: 'Verify email',
      ctaUrl: params.verifyUrl,
    })
  },
  businessInquiryReceived(params: { businessName: string; senderName: string; senderEmail: string; message: string; manageUrl?: string }) {
    return renderLayout({
      eyebrow: 'New inquiry',
      title: `New business inquiry for ${params.businessName}`,
      preview: 'A traveler has reached out through your Kenai Borough listing.',
      body: `<p style="margin:0 0 16px;">${params.senderName} ( ${params.senderEmail} ) submitted a new inquiry for <strong>${params.businessName}</strong>.</p><p style="margin:0;">Message preview: “${params.message}”</p>`,
      ctaLabel: 'Review inquiry',
      ctaUrl: params.manageUrl,
    })
  },
  tripPlannerInquiry(params: { travelerName: string; travelDates: string; groupSize: string; interests: string; recipients: string; dashboardUrl?: string }) {
    return renderLayout({
      eyebrow: 'Trip planner',
      title: 'New trip planner inquiry',
      preview: 'A multi-business itinerary request is ready for follow-up.',
      body: `<p style="margin:0 0 16px;">${params.travelerName} submitted a trip planner request for <strong>${params.travelDates}</strong> with a group size of <strong>${params.groupSize}</strong>.</p><p style="margin:0 0 16px;">Interests: ${params.interests}</p><p style="margin:0;">Routed to: ${params.recipients}</p>`,
      ctaLabel: 'Open planner inbox',
      ctaUrl: params.dashboardUrl,
    })
  },
  eventSubmissionConfirmation(params: { eventName: string; dashboardUrl?: string }) {
    return renderLayout({
      eyebrow: 'Events',
      title: 'Your event submission is in review',
      preview: 'Thanks for sending your event to the Kenai Borough calendar.',
      body: `<p style="margin:0 0 16px;">We received your event submission for <strong>${params.eventName}</strong>.</p><p style="margin:0;">Our team will review the details, confirm timing, and follow up if anything else is needed before publication.</p>`,
      ctaLabel: 'View event dashboard',
      ctaUrl: params.dashboardUrl,
    })
  },
  advertisingTierUpgradeConfirmation(params: { tierName: string; effectiveDate: string; dashboardUrl?: string }) {
    return renderLayout({
      eyebrow: 'Advertising',
      title: `Your ${params.tierName} plan is confirmed`,
      preview: 'Your upgraded advertising placement is ready to go live.',
      body: `<p style="margin:0 0 16px;">Your advertising tier upgrade to <strong>${params.tierName}</strong> has been scheduled.</p><p style="margin:0;">Effective date: <strong>${params.effectiveDate}</strong>. We will email performance updates after the placement launches.</p>`,
      ctaLabel: 'Review advertising',
      ctaUrl: params.dashboardUrl,
    })
  },
  propertyInquiry(params: { propertyTitle: string; buyerName: string; buyerEmail: string; buyerPhone?: string; message: string; propertyUrl?: string }) {
    return renderLayout({
      eyebrow: 'Property inquiry',
      title: `New inquiry for ${params.propertyTitle}`,
      preview: 'A prospective buyer wants details on your property listing.',
      body: `<p style="margin:0 0 16px;">${params.buyerName} submitted an inquiry for <strong>${params.propertyTitle}</strong>.</p><p style="margin:0 0 16px;">Contact: ${params.buyerEmail}${params.buyerPhone ? ` • ${params.buyerPhone}` : ''}</p><p style="margin:0;">Message preview: “${params.message}”</p>`,
      ctaLabel: 'Open property',
      ctaUrl: params.propertyUrl,
    })
  },
  inquiryConfirmation(params: { recipientName: string; listingTitle: string; detailUrl?: string }) {
    return renderLayout({
      eyebrow: 'Inquiry received',
      title: `We shared your message about ${params.listingTitle}`,
      preview: 'Your inquiry has been delivered to the listing owner.',
      body: `<p style="margin:0 0 16px;">Hi ${params.recipientName},</p><p style="margin:0 0 16px;">Your message about <strong>${params.listingTitle}</strong> has been sent to the owner.</p><p style="margin:0;">You will receive a reply by email as soon as the seller or host responds.</p>`,
      ctaLabel: 'View listing',
      ctaUrl: params.detailUrl,
    })
  },
  offerReceivedNotification(params: { listingTitle: string; buyerName: string; offerAmount: string; closingDate: string; offerUrl?: string }) {
    return renderLayout({
      eyebrow: 'Offer received',
      title: `New offer for ${params.listingTitle}`,
      preview: 'A buyer submitted an offer through your Kenai Network listing.',
      body: `<p style="margin:0 0 16px;">${params.buyerName} submitted a new offer.</p><p style="margin:0 0 16px;">Offer amount: <strong>${params.offerAmount}</strong></p><p style="margin:0;">Proposed closing date: <strong>${params.closingDate}</strong></p>`,
      ctaLabel: 'Review offer',
      ctaUrl: params.offerUrl,
    })
  },
  propertyStatusChange(params: { listingTitle: string; status: string; detailUrl?: string }) {
    return renderLayout({
      eyebrow: 'Listing update',
      title: `${params.listingTitle} is now ${params.status}`,
      preview: 'A listing you follow has changed status.',
      body: `<p style="margin:0 0 16px;">The status for <strong>${params.listingTitle}</strong> has been updated to <strong>${params.status}</strong>.</p><p style="margin:0;">Open the listing to review next steps and recent activity.</p>`,
      ctaLabel: 'View listing',
      ctaUrl: params.detailUrl,
    })
  },
  savedSearchMatchAlert(params: { searchName: string; summary: string; resultsUrl?: string }) {
    return renderLayout({
      eyebrow: 'Saved search',
      title: `New match for ${params.searchName}`,
      preview: 'Fresh listings match one of your saved search alerts.',
      body: `<p style="margin:0 0 16px;">We found new listings matching your saved search <strong>${params.searchName}</strong>.</p><p style="margin:0;">${params.summary}</p>`,
      ctaLabel: 'Review matches',
      ctaUrl: params.resultsUrl,
    })
  },
  dueDiligenceDocumentUploaded(params: { listingTitle: string; documentName: string; detailUrl?: string }) {
    return renderLayout({
      eyebrow: 'Due diligence',
      title: `New document uploaded for ${params.listingTitle}`,
      preview: 'A new due diligence file is ready for review.',
      body: `<p style="margin:0 0 16px;">A new document has been uploaded for <strong>${params.listingTitle}</strong>.</p><p style="margin:0;">File: <strong>${params.documentName}</strong></p>`,
      ctaLabel: 'View document center',
      ctaUrl: params.detailUrl,
    })
  },
  bookingRequest(params: { propertyTitle: string; guestName: string; stayDates: string; guestCount: string; detailUrl?: string }) {
    return renderLayout({
      eyebrow: 'Booking request',
      title: `New booking request for ${params.propertyTitle}`,
      preview: 'A guest submitted a new booking request through the rental marketplace.',
      body: `<p style="margin:0 0 16px;">${params.guestName} requested a stay at <strong>${params.propertyTitle}</strong>.</p><p style="margin:0 0 16px;">Dates: ${params.stayDates}</p><p style="margin:0;">Guests: ${params.guestCount}</p>`,
      ctaLabel: 'Review booking',
      ctaUrl: params.detailUrl,
    })
  },
  bookingConfirmation(params: { guestName: string; propertyTitle: string; stayDates: string; itineraryUrl?: string }) {
    return renderLayout({
      eyebrow: 'Booking confirmed',
      title: `Your stay at ${params.propertyTitle} is booked`,
      preview: 'Your reservation details are ready in your guest dashboard.',
      body: `<p style="margin:0 0 16px;">Hi ${params.guestName},</p><p style="margin:0 0 16px;">Your booking for <strong>${params.propertyTitle}</strong> is confirmed for <strong>${params.stayDates}</strong>.</p><p style="margin:0;">Keep an eye on your inbox for check-in instructions, local recommendations, and trip updates.</p>`,
      ctaLabel: 'View itinerary',
      ctaUrl: params.itineraryUrl,
    })
  },
  bookingCancellation(params: { propertyTitle: string; stayDates: string; supportUrl?: string }) {
    return renderLayout({
      eyebrow: 'Booking update',
      title: `Booking cancelled for ${params.propertyTitle}`,
      preview: 'A booking on your account has been cancelled.',
      body: `<p style="margin:0 0 16px;">The booking for <strong>${params.propertyTitle}</strong> covering <strong>${params.stayDates}</strong> has been cancelled.</p><p style="margin:0;">Review refund timelines, messaging history, and next steps from your dashboard.</p>`,
      ctaLabel: 'Open booking details',
      ctaUrl: params.supportUrl,
    })
  },
  reviewRequest(params: { propertyTitle: string; reviewUrl?: string }) {
    return renderLayout({
      eyebrow: 'Share feedback',
      title: `How was your stay at ${params.propertyTitle}?`,
      preview: 'Your review helps the Kenai rental community book with confidence.',
      body: `<p style="margin:0 0 16px;">Thanks for staying with us.</p><p style="margin:0;">A quick review for <strong>${params.propertyTitle}</strong> helps future guests and supports trusted hosts across the peninsula.</p>`,
      ctaLabel: 'Leave a review',
      ctaUrl: params.reviewUrl,
    })
  },
  messageNotification(params: { conversationLabel: string; senderName: string; messageSnippet: string; replyUrl?: string }) {
    return renderLayout({
      eyebrow: 'New message',
      title: `New message from ${params.senderName}`,
      preview: 'A new conversation update is waiting in your inbox.',
      body: `<p style="margin:0 0 16px;">Conversation: <strong>${params.conversationLabel}</strong></p><p style="margin:0;">“${params.messageSnippet}”</p>`,
      ctaLabel: 'Reply now',
      ctaUrl: params.replyUrl,
    })
  },
  payoutNotification(params: { propertyTitle: string; amount: string; payoutDate: string; dashboardUrl?: string }) {
    return renderLayout({
      eyebrow: 'Host payout',
      title: `Payout scheduled for ${params.propertyTitle}`,
      preview: 'Your latest host payout is ready for review.',
      body: `<p style="margin:0 0 16px;">A payout of <strong>${params.amount}</strong> is scheduled for <strong>${params.payoutDate}</strong>.</p><p style="margin:0;">Check your earnings dashboard for booking breakdowns, fees, and payout history.</p>`,
      ctaLabel: 'View payouts',
      ctaUrl: params.dashboardUrl,
    })
  },
  vehicleInquiry(params: { vehicleTitle: string; buyerName: string; buyerContact: string; message: string; detailUrl?: string }) {
    return renderLayout({
      eyebrow: 'Vehicle lead',
      title: `New vehicle inquiry for ${params.vehicleTitle}`,
      preview: 'A shopper reached out about one of your vehicles.',
      body: `<p style="margin:0 0 16px;">${params.buyerName} is interested in <strong>${params.vehicleTitle}</strong>.</p><p style="margin:0 0 16px;">Contact: ${params.buyerContact}</p><p style="margin:0;">Message preview: “${params.message}”</p>`,
      ctaLabel: 'Open vehicle listing',
      ctaUrl: params.detailUrl,
    })
  },
  vehicleStatusChange(params: { vehicleTitle: string; status: string; detailUrl?: string }) {
    return renderLayout({
      eyebrow: 'Inventory update',
      title: `${params.vehicleTitle} is now ${params.status}`,
      preview: 'A vehicle you follow has changed status.',
      body: `<p style="margin:0 0 16px;">The status for <strong>${params.vehicleTitle}</strong> changed to <strong>${params.status}</strong>.</p><p style="margin:0;">Open the listing for next steps or similar inventory suggestions.</p>`,
      ctaLabel: 'View vehicle',
      ctaUrl: params.detailUrl,
    })
  },
  dealerLeadNotification(params: { campaignName: string; contactName: string; contactEmail: string; detailUrl?: string }) {
    return renderLayout({
      eyebrow: 'Dealer lead',
      title: `New dealer lead for ${params.campaignName}`,
      preview: 'A new lead arrived from your promoted dealership placement.',
      body: `<p style="margin:0 0 16px;">${params.contactName} is interested in your featured dealer placement or inventory campaign.</p><p style="margin:0;">Reply to ${params.contactEmail} to continue the conversation.</p>`,
      ctaLabel: 'Open dealer dashboard',
      ctaUrl: params.detailUrl,
    })
  },
  listingInquiry(params: { listingTitle: string; senderName: string; senderContact: string; message: string; detailUrl?: string }) {
    return renderLayout({
      eyebrow: 'Listing inquiry',
      title: `New message for ${params.listingTitle}`,
      preview: 'Someone contacted you about one of your Kenai Listings posts.',
      body: `<p style="margin:0 0 16px;">${params.senderName} sent a message about <strong>${params.listingTitle}</strong>.</p><p style="margin:0 0 16px;">Contact: ${params.senderContact}</p><p style="margin:0;">Message preview: “${params.message}”</p>`,
      ctaLabel: 'Open listing',
      ctaUrl: params.detailUrl,
    })
  },
  listingExpirationWarning(params: { listingTitle: string; expiresOn: string; renewUrl?: string }) {
    return renderLayout({
      eyebrow: 'Listing expires soon',
      title: `${params.listingTitle} expires on ${params.expiresOn}`,
      preview: 'Renew your listing to keep it visible across the Kenai network.',
      body: `<p style="margin:0 0 16px;">Your listing <strong>${params.listingTitle}</strong> is almost due to expire.</p><p style="margin:0;">Renew now to keep your post visible to local buyers and browsers.</p>`,
      ctaLabel: 'Renew listing',
      ctaUrl: params.renewUrl,
    })
  },
  listingRenewedConfirmation(params: { listingTitle: string; expiresOn: string; dashboardUrl?: string }) {
    return renderLayout({
      eyebrow: 'Listing renewed',
      title: `${params.listingTitle} has been renewed`,
      preview: 'Your listing is active again and visible across the marketplace.',
      body: `<p style="margin:0 0 16px;">Your listing <strong>${params.listingTitle}</strong> is now renewed.</p><p style="margin:0;">New expiration date: <strong>${params.expiresOn}</strong>.</p>`,
      ctaLabel: 'Open dashboard',
      ctaUrl: params.dashboardUrl,
    })
  },
  flaggedContentNotification(params: { listingTitle: string; reason: string; detailUrl?: string }) {
    return renderLayout({
      eyebrow: 'Moderation',
      title: `Listing flagged: ${params.listingTitle}`,
      preview: 'A listing requires moderation review or owner follow-up.',
      body: `<p style="margin:0 0 16px;">Your listing <strong>${params.listingTitle}</strong> was flagged for review.</p><p style="margin:0;">Reason: ${params.reason}</p>`,
      ctaLabel: 'Review moderation details',
      ctaUrl: params.detailUrl,
    })
  },
}
