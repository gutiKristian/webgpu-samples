struct MatrixData
{
    model: mat4x4<f32>,
    view: mat4x4<f32>,
    projection: mat4x4<f32>
};

@binding(0) @group(0) var<uniform> transformUBO: MatrixData;

struct Fragment
{
    @builtin(position) Position: vec4<f32>,
    @location(0) Color: vec4<f32>
};


@vertex
fn vs_main(@location(0) vertex_pos: vec3<f32>, @location(1) vertex_col: vec3<f32>) -> Fragment // vertex shader main
{
    var out: Fragment;
                     // Perspective        Camera              World coordinates
    out.Position = transformUBO.projection * transformUBO.view * transformUBO.model * vec4<f32>(vertex_pos, 1.0);
    out.Color = vec4<f32>(vertex_col, 1.0);
    return out;
}


@fragment                                    // output to framebuffer 0 -> screen
fn fs_main(@location(0) Color: vec4<f32>) -> @location(0) vec4<f32>
{
    return Color;
}