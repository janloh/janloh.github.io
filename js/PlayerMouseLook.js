using System;
using UnityEngine;
using UnityStandardAssets.CrossPlatformInput;

public class PlayerMouseLook : MonoBehaviour
{
    [SerializeField]
    private float _mouseSensitivity = 100.0f;
    [SerializeField]
    private float _clampAngle = 80.0f;
    
    private float _rotY = 0.0f; // rotation around the up/y axis
    private float _rotX = 0.0f; // rotation around the right/x axis

    void Start()
    {
        Cursor.lockState = CursorLockMode.Locked;
        Vector3 rot = transform.localRotation.eulerAngles;
        _rotX = rot.x;
        _rotY = rot.y;
    }

    private void FixedUpdate()
    {
        MouseLookRotation();
    }

    public void MouseLookRotation()
    {
        float mouseX = CrossPlatformInputManager.GetAxis("Mouse X");
        float mouseY = -CrossPlatformInputManager.GetAxis("Mouse Y");

        _rotX += mouseX * _mouseSensitivity * Time.fixedDeltaTime;
        _rotY += mouseY * _mouseSensitivity * Time.fixedDeltaTime;

        _rotY = Mathf.Clamp(_rotY, -_clampAngle, _clampAngle);

        Quaternion localRotation = Quaternion.Euler(_rotY, _rotX, 0.0f);
        transform.rotation = localRotation;
    }
}