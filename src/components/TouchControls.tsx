import { useEffect, useState } from "react";

import type { TouchControlsState } from "./GameCanvas";

interface TouchControlsProps {
  onChange: (controls: TouchControlsState) => void;
}

const INITIAL_CONTROLS: TouchControlsState = {
  forward: false,
  backward: false,

  turnLeft: false,
  turnRight: false,

  fireFront: false,
  fireLeft: false,
  fireRight: false,

  pause: false,
};

export function TouchControls({ onChange }: TouchControlsProps) {
  const [controls, setControls] =
    useState<TouchControlsState>(INITIAL_CONTROLS);

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    function checkDevice() {
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

      const smallScreen = window.innerWidth <= 900;

      setIsTouchDevice(coarsePointer || smallScreen);
    }

    checkDevice();

    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  useEffect(() => {
    function releaseControls() {
      setControls(INITIAL_CONTROLS);

      onChange(INITIAL_CONTROLS);
    }

    window.addEventListener("pointerup", releaseControls);

    window.addEventListener("pointercancel", releaseControls);

    return () => {
      window.removeEventListener("pointerup", releaseControls);

      window.removeEventListener("pointercancel", releaseControls);
    };
  }, [onChange]);

  function setControl(control: keyof TouchControlsState, active: boolean) {
    setControls((current) => {
      const next = {
        ...current,

        [control]: active,
      };

      onChange(next);

      return next;
    });
  }

  if (!isTouchDevice) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.movement}>
        <ControlButton
          label="↑"
          active={controls.forward}
          onPress={() => setControl("forward", true)}
          onRelease={() => setControl("forward", false)}
        />

        <div style={styles.row}>
          <ControlButton
            label="↶"
            active={controls.turnLeft}
            onPress={() => setControl("turnLeft", true)}
            onRelease={() => setControl("turnLeft", false)}
          />

          <ControlButton
            label="↓"
            active={controls.backward}
            onPress={() => setControl("backward", true)}
            onRelease={() => setControl("backward", false)}
          />

          <ControlButton
            label="↷"
            active={controls.turnRight}
            onPress={() => setControl("turnRight", true)}
            onRelease={() => setControl("turnRight", false)}
          />
        </div>
      </div>

      <div style={styles.weapons}>
        <ControlButton
          label="LEFT"
          active={controls.fireLeft}
          onPress={() => setControl("fireLeft", true)}
          onRelease={() => setControl("fireLeft", false)}
        />

        <ControlButton
          label="FIRE"
          active={controls.fireFront}
          onPress={() => setControl("fireFront", true)}
          onRelease={() => setControl("fireFront", false)}
        />

        <ControlButton
          label="RIGHT"
          active={controls.fireRight}
          onPress={() => setControl("fireRight", true)}
          onRelease={() => setControl("fireRight", false)}
        />

        <ControlButton
          label="Ⅱ"
          active={controls.pause}
          onPress={() => setControl("pause", true)}
          onRelease={() => setControl("pause", false)}
        />
      </div>
    </div>
  );
}

interface ControlButtonProps {
  label: string;

  active: boolean;

  onPress: () => void;

  onRelease: () => void;
}

function ControlButton({
  label,
  active,
  onPress,
  onRelease,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      style={{
        ...styles.button,

        ...(active ? styles.activeButton : {}),
      }}
      onPointerDown={(event) => {
        event.preventDefault();

        onPress();
      }}
      onPointerUp={onRelease}
      onPointerLeave={onRelease}
    >
      {label}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "fixed",

    left: 0,
    right: 0,
    bottom: 16,

    zIndex: 5000,

    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-end",

    padding: "0 18px",

    pointerEvents: "none",
  },

  movement: {
    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    gap: "7px",

    pointerEvents: "auto",
  },

  weapons: {
    display: "grid",

    gridTemplateColumns: "repeat(2, 68px)",

    gap: "8px",

    pointerEvents: "auto",
  },

  row: {
    display: "flex",

    gap: "7px",
  },

  button: {
    width: "62px",

    height: "62px",

    borderRadius: "50%",

    border: "2px solid rgba(255,255,255,0.65)",

    background: "rgba(15,23,42,0.72)",

    color: "#ffffff",

    fontWeight: 800,

    fontSize: "14px",

    touchAction: "none",

    userSelect: "none",
  },

  activeButton: {
    transform: "scale(0.92)",

    background: "rgba(245,158,11,0.9)",
  },
};
