<script lang="ts">
  interface Props {
    value: boolean;
    title: string;
    onchange?: () => void;
  }

  let { value = $bindable(), title, onchange }: Props = $props();

  const handleChange = () => {
    value = !value;
    onchange?.();
  };
</script>

<label>
  <input type="checkbox" checked={value} onchange={handleChange} />
  <span class="slider"></span>
  <span>{title}</span>
</label>

<style lang="scss">
  @use 'sass:color';
  @use '../style/variables' as *;

  label {
    font-size: $font-size-small;
    display: flex;
    gap: 0.5em;
    cursor: pointer;
    user-select: none;
  }

  input {
    position: absolute;
    z-index: -1;
    left: 0;
    width: 0;
    height: 0;
    min-height: 0;
    min-width: 0;
    border: 0;
    background: none;
    user-select: none;
    pointer-events: none;
    box-shadow: none;
    opacity: 0;
  }

  .slider {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
    border-radius: 20px;
    background: $color-shade-3;
    transition: background 0.25s;
    @media (pointer: fine) {
      label:hover & {
        background: color.adjust($color-shade-3, $lightness: -5%);
      }
    }
    &:after {
      content: '';
      position: absolute;
      top: 3px;
      left: 4px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: $color-paper;
      transition: left 0.25s;
    }
  }

  input:checked + .slider {
    background: $color-success;
    @media (pointer: fine) {
      label:hover & {
        background: color.adjust($color-success, $lightness: -5%);
      }
    }
    &:after {
      left: 16px;
    }
  }
</style>
