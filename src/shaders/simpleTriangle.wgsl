struct Fragment
{
    @builtin(position) Position: vec4<f32>,
    @location(0) Color: vec4<f32>
};


var positions = array<vec2<f32>,3>
(
    vec2<f32>(-0.5, 0),
    vec2<f32>(0.5, 0),
    vec2<f32>(0, 0.5)
);

var colors = array<vec3<f32>,3>
(
    vec3<f32>(1.0, 0.0, 0.0),
    vec3<f32>(0.0, 1.0, 0.0),
    vec3<f32>(0.0, 0.0, 1.0)
);


@vertex
fn vs_main(@builtin(vertex_index) v_id: u32) -> Fragment // vertex shader main
{
    var out: Fragment;
    out.Position = vec4<f32>(positions[v_id], 0.0, 1.0);
    out.Color = vec4<f32>(colors[v_id], 1.0);
    return out;
}


@fragment                                    // output to framebuffer 0 -> screen
fn fs_main(@location(0) Color: vec4<f32>) -> @location(0) vec4<f32>
{
    return Color;
}