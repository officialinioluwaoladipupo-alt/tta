# TTA Website: Airtable Schema Guide

To connect your website to Airtable, you must create a Base with the following **Tables** and **Fields**. Field names are **case-sensitive**.

---

## 1. Table: `Settings`
Used for global site configuration.
> [!NOTE]
> Create only ONE record in this table.

| Field Name | Field ID | Field Type | Purpose |
| :--- | :--- | :--- | :--- |
| **siteName** | `fldJHiVrjfL3BeX4E` | Single Line Text | The main title of the website. |
| **siteDescription** | `fldmQGL4x54GUT8sB` | Long Text | Default SEO description. |
| **marqueeText** | `fldzwzjC7K5TwNIq7` | Long Text | The scrolling text in the header. |
| **defaultSeoImage**| `fldrq35F3RQmlo9E6` | **Attachment** | The default image shared on social media. |

---

## 2. Table: `Programs` (`tblHShOUifU1m6EkS`)
Used for the dynamic course pages.

| Field Name | Field ID | Field Type | Purpose |
| :--- | :--- | :--- | :--- |
| **title** | `fldJGpX7Oj9ElKfAi` | Single Line Text | Program name (e.g. "LOCKEDIN"). |
| **slug** | `fldposSLgP7UKY3oU` | Single Line Text | URL path (e.g. `locked-in-2026`). |
| **label** | `fldtOunVPReRnvVGz` | Single Line Text | Secondary label (e.g. "Operational Training"). |
| **status** | `fldger01xzPMYfiZh` | Single Select | Options: `Active`, `Closed`, `Upcoming`. |
| **description** | `fldYzRVAc6wWZayWE` | Long Text | Brief summary for the card view. |
| **content** | `fldtM2lAoLIlotb5H` | Long Text (MDX) | Full page content. Supports markdown. |
| **image** | `fldmfK9ySWvpVCPE8` | **Attachment** | Main hero image for the program. |
| **featured** | `fldkKaRGFxoAhK2j6` | Tickbox | If checked, appears first on the list. |
| **seoTitle** | `fldfEd5BB5ShohfnS` | Single Line Text | Meta title for this program. |
| **seoDescription**| `fldB2tqhZErMqcTUr` | Long Text | Meta description for this program. |
| **seoImage** | `fldg9Eg7AHrksMmMp` | **Attachment** | Specific SEO image for this program. |

---

## 3. Table: `Events` (`tblbv7qDvZjkWz298`)
Used for the schedule and masterclasses.

| Field Name | Field ID | Field Type | Purpose |
| :--- | :--- | :--- | :--- |
| **title** | `fld60g2Jlm4glr70e` | Single Line Text | Event name. |
| **slug** | `fldfuCZ1yt5Hk0DZp` | Single Line Text | Unique URL for this event. |
| **description** | `flddPxpiutxYsuYzL` | Long Text | Full event details. |
| **shortDescription**| `fldfWdfSuxHY7iSbA` | Long Text | Brief summary. |
| **date** | `fldnqKLlla00mhERq` | Date & Time | Event start time (Set to ISO). |
| **location** | `fldCCH17B42hKfQM9` | Single Line Text | Online or Physical address. |
| **image** | `fldC3VHA5QJfiLh9W` | **Attachment** | Poster or Hero image for the event. |
| **link** | `fld6Azz8y9qUZAXSx` | URL | Luma registration link. |
| **tags** | `fld3vQXMLYCgvuiYT` | Multiple Select | e.g. `Masterclass`, `Workshop`. |
| **status** | `fldEA33iR5rPpAEBG` | Single Select | Options: `upcoming`, `past`, `full`. |
| **speakers** | `fld61jNMCFHDGQ2Nq` | Long Text (JSON) | Optional: `[{"name": "Name", "role": "Role"}]`. |
| **formFields** | `fldHN3QsyDBplRa0L` | Long Text (JSON) | Optional: Custom registration fields. |
| **learningPoints**| `fld...`            | Long Text        | Bulleted list of what attendees will learn. |
| **seoDescription**| `fld...`            | Long Text        | Custom meta description for the event. |
| **seoImage**       | `fld...`            | **Attachment**   | Custom OpenGraph image for the event. |
| **Program** | `fldTkazeRK5y9e8er` | Link to Record | Link to the Programs table. |

---

## 4. Table: `Highlights` (`tblA6otl7k9GEIKzr`)
Used for the "Live Intel" community feed.

| Field Name | Field ID | Field Type | Purpose |
| :--- | :--- | :--- | :--- |
| **text** | `fldgZo63Sh0FIouxr` | Long Text | The headline or update text. |
| **type** | `fldhj9z8zUncd2WHt` | Single Select | Options: `speaker`, `news`, `recap`. |
| **link** | `fldwUq6RZ8GORfYEU` | URL | Link to a Telegram post or article. |
| **image** | `fld7Bc63XfnJ2rtNV` | **Attachment** | Image displayed in the marquee card. |
| **isActive** | `fldm41s0glSxCrw4Z` | Tickbox | Must be checked to appear on the site. |
| **expiryDate** | `fldj7sHOsPwLXNAzE` | Date & Time | Optional: When the update should vanish. |
| **relatedEvent**| `fldAZi9OozzaTdCzf` | Link to Record | Link to the Events table. |

---

### Implementation Notes
- **Images**: Use the `Attachment` field type. The website will automatically pull the URL of the first attached file.
- **Tickboxes**: Use for `isActive` and `featured`.
- **JSON Fields**: For advanced speakers/forms, use valid JSON arrays.
