# graph-internet-domain

## Overview

A JupiterOne integration that ingests domain information from Whois service.

## Integration Instance Configuration

The integration is triggered by an event containing the information for a
specific integration instance.

The integration instance configuration expects a comma separated lists of
domains. For example:

```
google.com,facebook.com
```

## Entities

The following entity resources are ingested when the integration runs:

| Entity Resource | \_type : \_class of the Entity                |
| ----------------------- | ------------------------------------- |
| Domain                  | `internet_domain` : `Domain`          |
