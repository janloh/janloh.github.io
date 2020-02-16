using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof (Collider))]
public class GroundCheck : MonoBehaviour
{
    public bool IsGrounded { get; private set; }

    private void Awake()
    {
        IsGrounded = true;
    }

    private void OnTriggerEnter(Collider other)
    {
        IsGrounded = true;
    }

    private void OnTriggerExit(Collider other)
    {
        IsGrounded = false;
    }
}