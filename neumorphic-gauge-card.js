/**
 * Neumorphic Gauge Card
 * A beautiful neumorphic-styled gauge card for Home Assistant
 * 
 * @version 1.0.0
 * @author Tommy Sadiq Hinrichsen
 */

class NeumorphicGaugeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = {};
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }

    this._config = {
      name: config.name || 'Gauge',
      entity: config.entity,
      min: config.min || 0,
      max: config.max || 100,
      unit: config.unit || '',
      severity: config.severity || {},
      needle: config.needle !== false,
      segments: config.segments || [],
      decimals: config.decimals || 1,
      show_minmax: config.show_minmax !== false,
      show_state: config.show_state !== false,
      icon: config.icon || null,
      theme: config.theme || 'light',
      ...config
    };

    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.updateGauge();
  }

  getCardSize() {
    return 4;
  }

  render() {
    const theme = this._config.theme;
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .card {
          background: var(--neumorphic-bg, #e6e7ee);
          border-radius: var(--neumorphic-radius, 1.5rem);
          padding: 1.5rem;
          box-shadow: var(--neumorphic-shadow, 9px 9px 16px #b8b9be, -9px -9px 16px #ffffff);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .card:hover {
          box-shadow: var(--neumorphic-shadow-hover, 12px 12px 20px #b8b9be, -12px -12px 20px #ffffff);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .card-title {
          color: var(--neumorphic-text, #44476A);
          font-size: 1.125rem;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .card-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          background: var(--neumorphic-bg, #e6e7ee);
          box-shadow: var(--neumorphic-shadow-sm, 4px 4px 8px #b8b9be, -4px -4px 8px #ffffff);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--neumorphic-accent, #31344b);
          font-size: 1.25rem;
        }

        .gauge-container {
          position: relative;
          width: 100%;
          padding: 1.25rem 0;
        }

        .gauge-svg {
          width: 100%;
          height: auto;
          filter: drop-shadow(3px 3px 6px rgba(184, 185, 190, 0.3));
        }

        .gauge-bg {
          fill: none;
          stroke: var(--neumorphic-track, #d1d9e6);
          stroke-width: 12;
          stroke-linecap: round;
        }

        .gauge-progress {
          fill: none;
          stroke-width: 12;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .gauge-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .gauge-value {
          font-size: 3rem;
          font-weight: 700;
          color: var(--neumorphic-accent, #31344b);
          line-height: 1;
          margin-bottom: 0.3125rem;
        }

        .gauge-unit {
          font-size: 0.875rem;
          color: var(--neumorphic-text-secondary, #7C7E8C);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .gauge-label {
          font-size: 0.8125rem;
          color: var(--neumorphic-text-muted, #8A93A5);
          margin-top: 0.5rem;
        }

        .gauge-range {
          display: flex;
          justify-content: space-between;
          margin-top: 0.9375rem;
          padding: 0 0.625rem;
        }

        .range-value {
          font-size: 0.75rem;
          color: var(--neumorphic-text-secondary, #7C7E8C);
          font-weight: 500;
          padding: 0.375rem 0.75rem;
          background: var(--neumorphic-bg, #e6e7ee);
          border-radius: 0.5rem;
          box-shadow: var(--neumorphic-shadow-inset, inset 2px 2px 4px #b8b9be, inset -2px -2px 4px #ffffff);
        }

        .needle-container {
          position: relative;
          width: 12.5rem;
          height: 12.5rem;
          margin: 0 auto;
        }

        .needle {
          position: absolute;
          bottom: 50%;
          left: 50%;
          width: 0.25rem;
          height: 5rem;
          background: linear-gradient(to top, var(--neumorphic-accent, #31344b), var(--neumorphic-text-secondary, #7C7E8C));
          border-radius: 0.125rem 0.125rem 0 0;
          transform-origin: bottom center;
          transform: translateX(-50%) rotate(0deg);
          transition: transform 1s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 2px 2px 4px rgba(184, 185, 190, 0.5);
        }

        .needle::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 1rem;
          height: 1rem;
          background: var(--neumorphic-accent, #31344b);
          border-radius: 50%;
          box-shadow: inset 2px 2px 4px rgba(38, 40, 51, 0.3), inset -2px -2px 4px rgba(68, 71, 106, 0.3);
        }

        .state-badge {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          background: var(--state-color, #4CAF50);
          box-shadow: 0 0 10px var(--state-color, rgba(76, 175, 80, 0.5));
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Dark mode support */
        :host([theme="dark"]) .card {
          --neumorphic-bg: #262833;
          --neumorphic-shadow: 9px 9px 16px #1a1b25, -9px -9px 16px #31344b;
          --neumorphic-shadow-hover: 12px 12px 20px #1a1b25, -12px -12px 20px #31344b;
          --neumorphic-shadow-sm: 4px 4px 8px #1a1b25, -4px -4px 8px #31344b;
          --neumorphic-shadow-inset: inset 2px 2px 4px #1a1b25, inset -2px -2px 4px #31344b;
          --neumorphic-text: #D1D9E6;
          --neumorphic-text-secondary: #8A93A5;
          --neumorphic-text-muted: #7C7E8C;
          --neumorphic-accent: #e6e7ee;
          --neumorphic-track: #31344b;
        }

        /* Additional attributes support */
        .attributes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.9375rem;
          margin-top: 1.5625rem;
        }

        .attribute-item {
          background: var(--neumorphic-bg, #e6e7ee);
          padding: 0.9375rem;
          border-radius: 0.9375rem;
          box-shadow: var(--neumorphic-shadow-inset, inset 3px 3px 6px #b8b9be, inset -3px -3px 6px #ffffff);
        }

        .attribute-label {
          font-size: 0.6875rem;
          color: var(--neumorphic-text-muted, #8A93A5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.3125rem;
        }

        .attribute-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--neumorphic-accent, #31344b);
        }
      </style>
      
      <ha-card>
        <div class="card" id="card">
          <div class="state-badge" id="stateBadge"></div>
          
          <div class="card-header">
            <div class="card-title" id="title"></div>
            <div class="card-icon" id="icon"></div>
          </div>
          
          <div id="gaugeContent"></div>
          
          <div class="gauge-range" id="rangeDisplay" style="display: none;">
            <span class="range-value" id="minValue"></span>
            <span class="range-value" id="maxValue"></span>
          </div>

          <div class="attributes" id="attributes" style="display: none;"></div>
        </div>
      </ha-card>
    `;
  }

  updateGauge() {
    if (!this._hass || !this._config.entity) return;

    const entityId = this._config.entity;
    const stateObj = this._hass.states[entityId];
    
    if (!stateObj) {
      this.shadowRoot.getElementById('title').textContent = 'Entity not found';
      return;
    }

    const value = parseFloat(stateObj.state);
    const unit = this._config.unit || stateObj.attributes.unit_of_measurement || '';
    
    // Update title
    this.shadowRoot.getElementById('title').textContent = this._config.name;
    
    // Update icon
    const iconEl = this.shadowRoot.getElementById('icon');
    if (this._config.icon) {
      iconEl.innerHTML = this.getIconHtml(this._config.icon, stateObj);
    } else {
      iconEl.style.display = 'none';
    }

    // Update state badge color
    const stateBadge = this.shadowRoot.getElementById('stateBadge');
    stateBadge.style.setProperty('--state-color', this.getStateColor(value));

    // Render gauge type
    const gaugeContent = this.shadowRoot.getElementById('gaugeContent');
    if (this._config.needle) {
      gaugeContent.innerHTML = this.renderNeedleGauge(value, unit);
      setTimeout(() => this.updateNeedle(value), 100);
    } else {
      gaugeContent.innerHTML = this.renderCircularGauge(value, unit);
      setTimeout(() => this.updateCircularProgress(value), 100);
    }

    // Show min/max
    if (this._config.show_minmax) {
      const rangeDisplay = this.shadowRoot.getElementById('rangeDisplay');
      rangeDisplay.style.display = 'flex';
      this.shadowRoot.getElementById('minValue').textContent = `${this._config.min}${unit}`;
      this.shadowRoot.getElementById('maxValue').textContent = `${this._config.max}${unit}`;
    }

    // Show additional attributes
    if (this._config.attributes && this._config.attributes.length > 0) {
      this.renderAttributes(stateObj);
    }
  }

  renderCircularGauge(value, unit) {
    const gradient = this.getGradientId();
    const displayValue = value.toFixed(this._config.decimals).replace('.', ',');
    
    return `
      <div class="gauge-container">
        <svg class="gauge-svg" viewBox="0 0 200 120">
          <defs>
            ${this.getGradientDef(gradient)}
          </defs>
          <path class="gauge-bg" d="M 30 100 A 70 70 0 0 1 170 100" />
          <path class="gauge-progress" id="progressArc" d="M 30 100 A 70 70 0 0 1 170 100" 
                style="stroke: url(#${gradient})" />
        </svg>
        
        <div class="gauge-center">
          <div class="gauge-value">${displayValue}</div>
          <div class="gauge-unit">${unit}</div>
          ${this._config.show_state ? `<div class="gauge-label">${this._config.name}</div>` : ''}
        </div>
      </div>
    `;
  }

  renderNeedleGauge(value, unit) {
    const gradient = this.getGradientId();
    const displayValue = value.toFixed(this._config.decimals).replace('.', ',');
    
    return `
      <div class="needle-container">
        <svg class="gauge-svg" viewBox="0 0 200 120">
          <defs>
            ${this.getGradientDef(gradient)}
          </defs>
          <path class="gauge-bg" d="M 30 100 A 70 70 0 0 1 170 100" />
          <path class="gauge-progress" id="progressArc" d="M 30 100 A 70 70 0 0 1 170 100" 
                style="stroke: url(#${gradient})" />
        </svg>
        
        <div class="needle" id="needle"></div>
        
        <div class="gauge-center" style="top: 65%">
          <div class="gauge-value">${displayValue}</div>
          <div class="gauge-unit">${unit}</div>
          ${this._config.show_state ? `<div class="gauge-label">${this._config.name}</div>` : ''}
        </div>
      </div>
    `;
  }

  updateCircularProgress(value) {
    const percentage = ((value - this._config.min) / (this._config.max - this._config.min)) * 100;
    const circumference = 220;
    const offset = circumference - (percentage / 100) * circumference;
    
    const arc = this.shadowRoot.getElementById('progressArc');
    if (arc) {
      arc.style.strokeDasharray = `${circumference} ${circumference}`;
      arc.style.strokeDashoffset = offset;
    }
  }

  updateNeedle(value) {
    const percentage = (value - this._config.min) / (this._config.max - this._config.min);
    const angle = -90 + (percentage * 180);
    
    const needle = this.shadowRoot.getElementById('needle');
    if (needle) {
      needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
  }

  getGradientId() {
    if (this._config.segments && this._config.segments.length > 0) {
      return 'customGradient';
    }
    return 'defaultGradient';
  }

  getGradientDef(id) {
    if (this._config.segments && this._config.segments.length > 0) {
      const stops = this._config.segments.map((seg, index) => {
        const offset = ((seg.from - this._config.min) / (this._config.max - this._config.min)) * 100;
        return `<stop offset="${offset}%" style="stop-color:${seg.color};stop-opacity:1" />`;
      }).join('');
      
      return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">${stops}</linearGradient>`;
    }
    
    // Default gradient
    return `
      <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#FFC107;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#f44336;stop-opacity:1" />
      </linearGradient>
    `;
  }

  getStateColor(value) {
    if (this._config.severity) {
      if (this._config.severity.red !== undefined && value <= this._config.severity.red) return '#f44336';
      if (this._config.severity.yellow !== undefined && value <= this._config.severity.yellow) return '#FFC107';
      if (this._config.severity.green !== undefined && value >= this._config.severity.green) return '#4CAF50';
    }
    return '#4CAF50';
  }

  getIconHtml(icon, stateObj) {
    if (icon.startsWith('mdi:')) {
      return `<ha-icon icon="${icon}"></ha-icon>`;
    }
    return icon;
  }

  renderAttributes(stateObj) {
    const attributesContainer = this.shadowRoot.getElementById('attributes');
    if (!this._config.attributes) return;

    attributesContainer.style.display = 'grid';
    attributesContainer.innerHTML = this._config.attributes.map(attr => {
      const value = stateObj.attributes[attr.attribute];
      const label = attr.name || attr.attribute;
      const unit = attr.unit || '';
      
      return `
        <div class="attribute-item">
          <div class="attribute-label">${label}</div>
          <div class="attribute-value">${value}${unit}</div>
        </div>
      `;
    }).join('');
  }

  static getStubConfig() {
    return {
      entity: 'sensor.example',
      name: 'Example Gauge',
      min: 0,
      max: 100,
      needle: false
    };
  }
}

customElements.define('neumorphic-gauge-card', NeumorphicGaugeCard);

// Register the card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'neumorphic-gauge-card',
  name: 'Neumorphic Gauge Card',
  description: 'A beautiful neumorphic-styled gauge card',
  preview: true,
  documentationURL: 'https://github.com/yourusername/neumorphic-gauge-card'
});

console.info(
  '%c NEUMORPHIC-GAUGE-CARD %c 1.0.0 ',
  'color: white; background: #31344b; font-weight: 700;',
  'color: #31344b; background: white; font-weight: 700;'
);
